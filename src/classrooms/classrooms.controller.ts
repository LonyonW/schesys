import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ClassroomsService } from './classrooms.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { Classroom } from './classroom.entity';
import { hasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-role';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
import { FilterClassroomDto } from './dto/filter-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';

@Controller('classrooms')
export class ClassroomsController {
    constructor(private readonly classroomsService: ClassroomsService) { }


    @hasRoles(JwtRole.ADMIN, JwtRole.DIRECTOR) // PTOTECCION DE RUTAS por rol
    @UseGuards(JwtAuthGuard, JwtRolesGuard) // PTOTECCION DE RUTAS token obligado
    @Post('create') // http://localhost:3000/classrooms/create -> POST
    create(@Body() data: CreateClassroomDto): Promise<Classroom> {
        return this.classroomsService.create(data);
    }

    @hasRoles(JwtRole.ADMIN, JwtRole.DIRECTOR, JwtRole.SECRETARY) // PTOTECCION DE RUTAS por rol
    @UseGuards(JwtAuthGuard, JwtRolesGuard) // PTOTECCION DE RUTAS token obligado
    @Get('search')
    searchClassrooms(
        @Query() filter: FilterClassroomDto,
    ): Promise<Classroom[]> {
        return this.classroomsService.searchClassrooms(filter);
    }

    @hasRoles(JwtRole.ADMIN, JwtRole.DIRECTOR, JwtRole.SECRETARY) // PTOTECCION DE RUTAS por rol
    @UseGuards(JwtAuthGuard, JwtRolesGuard) // PTOTECCION DE RUTAS token obligado
    @Patch(':id')
    updateClassroom(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateClassroomDto: UpdateClassroomDto,
    ): Promise<Classroom> {
        return this.classroomsService.update(id, updateClassroomDto);
    }
}
