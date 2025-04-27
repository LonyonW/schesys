import { Controller, Post, Body, UseGuards, Get, Query, Patch, Param, ParseIntPipe } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { hasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-role';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
import { FilterTeacherDto } from './dto/filter-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Controller('teachers')
export class TeachersController {
    constructor(private readonly teachersService: TeachersService) { }


    @hasRoles(JwtRole.DIRECTOR, JwtRole.ADMIN) // PTOTECCION DE RUTAS por rol
    @UseGuards(JwtAuthGuard, JwtRolesGuard) // PTOTECCION DE RUTAS token obligado
    @Post('create')
    create(@Body() data: CreateTeacherDto) {
        return this.teachersService.create(data);
    }

    @hasRoles(JwtRole.DIRECTOR, JwtRole.ADMIN, JwtRole.SECRETARY) // PTOTECCION DE RUTAS por rol
    @UseGuards(JwtAuthGuard, JwtRolesGuard) // PTOTECCION DE RUTAS token obligado
    @Get('search')
    searchTeachers(@Query() filter: FilterTeacherDto) {
        return this.teachersService.searchTeachers(filter);
    }

    @hasRoles(JwtRole.DIRECTOR, JwtRole.ADMIN) // PTOTECCION DE RUTAS por rol
    @UseGuards(JwtAuthGuard, JwtRolesGuard) // PTOTECCION DE RUTAS token obligado
    @Patch(':id')
    updateTeacher(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: UpdateTeacherDto,
    ) {
        return this.teachersService.updateTeacher(id, data);
    }

}
