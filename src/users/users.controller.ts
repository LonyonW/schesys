import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-dto-user';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-dto-user';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
import { hasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-role';
import { Req } from '@nestjs/common';

@Controller('users')
export class UsersController {
    
    
    constructor(private usersService: UsersService) {}


    @hasRoles(JwtRole.ADMIN, JwtRole.DIRECTOR) // PTOTECCION DE RUTAS por rol
    @UseGuards(JwtAuthGuard, JwtRolesGuard) // PTOTECCION DE RUTAS token obligado
    @Get() // http://localhost:3000/users -> GET
    findAll() {
        return this.usersService.findall();
    }

    @Post() // http://localhost:3000/users -> POST
    create(@Body() user: CreateUserDto) {
        return this.usersService.create(user);
    }


    // Los usuarios comunes solo pueden modificar su propio perfil
    @UseGuards(JwtAuthGuard)
    @hasRoles(JwtRole.ADMIN, JwtRole.DIRECTOR, JwtRole.SECRETARY) // <- o como tengas tus roles
    @Put('me') // http://localhost:3000/users/me // me indica que solo el usuario actualmente autenticado se puede modificar
    updateOwnProfile(@Req() req, @Body() user: UpdateUserDto) {
        const userId = req.user.id; 
        return this.usersService.update(userId, user);
    }

    // Solo admin puede modificar cualquier usuario
    @UseGuards(JwtAuthGuard)
    @hasRoles(JwtRole.ADMIN) // <- solo admin
    @Put(':id') // http://localhost:3000/users/:id
    updateByAdmin(@Param('id', ParseIntPipe) id: number, @Body() user: UpdateUserDto) {
    return this.usersService.update(id, user);
    }

}
