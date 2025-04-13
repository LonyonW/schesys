import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { In, Repository } from 'typeorm';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { compare } from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { Rol } from 'src/roles/rol.entity';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private usersRepository: Repository<User>, 
    @InjectRepository(Rol) private rolesRepository: Repository<Rol>,
    private jwtService: JwtService, // Inject the JwtService
) {}

    async register(user: RegisterAuthDto) {
        const { email, rolesIds } = user;

        const emailExists = await this.usersRepository.findOneBy({ email });

        if (emailExists) {
            throw new HttpException('Email already exists', HttpStatus.CONFLICT); // 409
        }

        if (!rolesIds || !Array.isArray(rolesIds) || rolesIds.length === 0) {
            throw new HttpException('At least one role must be specified', HttpStatus.BAD_REQUEST); // 400
        }

        const roles = await this.rolesRepository.findBy({ id: In(rolesIds) });

        // Validar que todos los roles existan
        const foundRoleIds = roles.map(role => role.id);
        const invalidRoles = rolesIds.filter(id => !foundRoleIds.includes(id));

        if (invalidRoles.length > 0) {
            throw new HttpException(`Invalid role(s): ${invalidRoles.join(', ')}`, HttpStatus.BAD_REQUEST); // 400
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
            relations: ['roles'] // Include roles in the query
         }); 

        if (!userFound) {
            throw new HttpException('Email not found', HttpStatus.NOT_FOUND); //404
        }

        const passwordMatches = await compare(password, userFound.password);

        if (!passwordMatches) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED); //401
        }

        const rolesIds = userFound.roles.map(rol => rol.id); // Get only de ids of the roles

        const payload = { id: userFound.id, first_name: userFound.first_name, roles: rolesIds };
        const token = this.jwtService.sign(payload); // Generate JWT token

        const data = {
            user: userFound,
            token: 'Bearer ' + token,
        }

        delete data.user.password; // Remove password from user data
        return data;


    }
}