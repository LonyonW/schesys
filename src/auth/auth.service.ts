import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { In, Repository } from 'typeorm';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { compare } from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { Rol } from 'src/roles/rol.entity';
import { MailService } from 'src/mail/mail.service';
import { hash } from "bcrypt";
import { ForgotPasswordDto } from './dto/forgot-password.dto';


@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private usersRepository: Repository<User>, 
    @InjectRepository(Rol) private rolesRepository: Repository<Rol>,
    private jwtService: JwtService, 
    private mailService: MailService, 
) {}

    async register(user: RegisterAuthDto) {
        const { email, rolesIds } = user;

        const emailExists = await this.usersRepository.findOneBy({ email });

        if (emailExists) {
            throw new HttpException('Email already exists', HttpStatus.CONFLICT); // 409 error de conflicto
        }

        if (!rolesIds || !Array.isArray(rolesIds) || rolesIds.length === 0) {
            throw new HttpException('At least one role must be specified', HttpStatus.BAD_REQUEST); // 400 error de bad request
        }

        const roles = await this.rolesRepository.findBy({ id: In(rolesIds) });

        // Validar que todos los roles existan
        const foundRoleIds = roles.map(role => role.id);
        const invalidRoles = rolesIds.filter(id => !foundRoleIds.includes(id));

        if (invalidRoles.length > 0) {
            throw new HttpException(`Invalid role(s): ${invalidRoles.join(', ')}`, HttpStatus.BAD_REQUEST); // 400 error de bad request
        }

        const newUser = this.usersRepository.create(user);
        newUser.roles = roles;

        const userSaved = await this.usersRepository.save(newUser);

        const rolesString = userSaved.roles.map(rol => rol.id);
        const payload = { id: userSaved.id, first_name: userSaved.first_name, roles: rolesString };
        const token = this.jwtService.sign(payload);

        const data = {
            user: userSaved,
            token: 'Bearer ' + token,
        };

        delete data.user.password;

        return data;
    }

    async login(loginData: LoginAuthDto) {

        const { email, password } = loginData;
        const userFound = await this.usersRepository.findOne({ 
            where: { email: email },
            relations: ['roles'] // Incluir el rol en la query
         }); 

        if (!userFound) {
            throw new HttpException('Email not found', HttpStatus.NOT_FOUND); //404 error de no encontrado
        }

        // Verificar si el usuario está activo
        if (!userFound.is_active) {
            throw new HttpException('User is inactive', HttpStatus.FORBIDDEN); //403 error de prohibido
        }

        const passwordMatches = await compare(password, userFound.password); // comparacion de hashes de password

        if (!passwordMatches) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED); //401 no autorizado credenciales invalidas
        }

        const rolesIds = userFound.roles.map(rol => rol.id); // obtener los ids de los roles

        const payload = { id: userFound.id, first_name: userFound.first_name, roles: rolesIds };
        const token = this.jwtService.sign(payload); // Generar el JWT token usando id, first_name y rol

        const data = {
            user: userFound,
            token: 'Bearer ' + token,
        }

        delete data.user.password; // quitar la password del retorno para que no se vea en el frontend
        return data;


    }

    async sendPasswordResetLink(forgotData: ForgotPasswordDto): Promise<{ message: string, token: string }> {

        const { email } = forgotData;

        const user = await this.usersRepository.findOne({ 
          where: { email: email },
          relations: ['roles'] 
        });


        if (!user) {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND); //404 usuario no encontrado
        }
      
        const token = this.jwtService.sign({ email }, {
          secret: 'process.env.JWT_RESET_SECRET', //  para probar unicamente CAMBIAR
          expiresIn: '15m',
        });
      
        const resetLink = `https://frontend.com/reset-password?token=${token}`;
      
        // Integrar el servicio de mail
        await this.mailService.sendResetEmail(user.email, resetLink);
      
        return {
          message: 'Password reset link sent',
          token: token, 
        };
      }
      
      async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
        try {
          const { email } = this.jwtService.verify(token, {
            secret: 'process.env.JWT_RESET_SECRET', // para probar unicamente CAMBIAR
          });
      
          const user = await this.usersRepository.findOneBy({ email });
          if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND); //404 usuario no encontrado
          }
      
          //user.password = await hash(newPassword, 10);
          user.password = await hash(newPassword, Number(process.env.HASH_SALT)); // rehasheo de la nueva password

          await this.usersRepository.save(user);
      
          return { message: 'Password updated successfully' };
        } catch (e) {
          throw new HttpException('Invalid or expired token', HttpStatus.UNAUTHORIZED);
        }
      }
      
}