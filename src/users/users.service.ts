import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-dto-user';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-dto-user';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
    ){}

    create(user: CreateUserDto) {
        const newUser = this.usersRepository.create(user);
        return this.usersRepository.save(newUser);
    }

    findall() {
        return this.usersRepository.find( { relations: ['roles'] } );
    }

    async update(id: number, user: UpdateUserDto) {
        const userFound = await this.usersRepository.findOneBy({ id: id });

        if (!userFound) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND); //404
        }

        const updatedUser = Object.assign(userFound, user);
        return this.usersRepository.save(updatedUser);
    }


}
