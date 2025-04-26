import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { hasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-role';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';

@Controller('teachers')
export class TeachersController {
    constructor(private readonly teachersService: TeachersService) { }


    @hasRoles(JwtRole.DIRECTOR, JwtRole.ADMIN) // PTOTECCION DE RUTAS por rol
    @UseGuards(JwtAuthGuard, JwtRolesGuard) // PTOTECCION DE RUTAS token obligado
    @Post('create')
    create(@Body() data: CreateTeacherDto) {
        return this.teachersService.create(data);
    }

}
