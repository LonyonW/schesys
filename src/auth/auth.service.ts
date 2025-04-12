import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { compare } from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private usersRepository: Repository<User>, 
    private jwtService: JwtService, // Inject the JwtService
) {}

    async register(user: RegisterAuthDto) {

        const { email } = user;

        const emailExists = await this.usersRepository.findOneBy({ email: email });

        if (emailExists) {
            return new HttpException('Email already exists', HttpStatus.CONFLICT); //409
        }

        const newUser = this.usersRepository.create(user);
        return this.usersRepository.save(newUser);
    }

    async login(loginData: LoginAuthDto) {

        const { email, password } = loginData;
        const userFound = await this.usersRepository.findOneBy({ email: email }); 

        if (!userFound) {
            return new HttpException('Email not found', HttpStatus.NOT_FOUND); //404
        }

        const passwordMatches = await compare(password, userFound.password);

        if (!passwordMatches) {
            return new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED); //401
        }

        const payload = { id: userFound.id, first_name: userFound.first_name };
        const token = this.jwtService.sign(payload); // Generate JWT token

        const data = {
            user: userFound,
            token: token,
        }
        return data;


    }
}