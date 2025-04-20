import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { SubjectsService } from './subjects.service';
import { hasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-role';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
import { FilterSubjectDto } from './dto/filter-subject.dto';

@Controller('subjects')
export class SubjectsController {
    constructor(private readonly subjectService: SubjectsService) { }


    @hasRoles(JwtRole.ADMIN, JwtRole.DIRECTOR) // PTOTECCION DE RUTAS por rol
    @UseGuards(JwtAuthGuard, JwtRolesGuard) // PTOTECCION DE RUTAS token obligado
    @Post('create') // http://localhost:3000/subjects/create -> POST
    create(@Body() dto: CreateSubjectDto) {
        return this.subjectService.create(dto);
    }

    @hasRoles(JwtRole.ADMIN, JwtRole.DIRECTOR, JwtRole.SECRETARY) // PTOTECCION DE RUTAS por rol
    @UseGuards(JwtAuthGuard, JwtRolesGuard) // PTOTECCION DE RUTAS token obligado   
    @Get('search') // http://localhost:3000/subjects/search -> GET
    async search(@Query() filter: FilterSubjectDto) {
        return this.subjectService.searchSubjects(filter);
    }

}
