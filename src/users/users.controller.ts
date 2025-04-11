import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-dto-user';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    
    
    constructor(private usersService: UsersService) {}

    @Post() // http://localhost:3000/users -> POST
    create(@Body() user: CreateUserDto) {
        return this.usersService.create(user);
    }

}
