import { Controller, Post, Get, Patch, Param, Body, ParseIntPipe, UseGuards, Query } from '@nestjs/common';
import { hasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-role';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { FilterSessionDto } from './dto/filter-session.dto';

@Controller('sessions')
export class SessionsController {
    constructor(private readonly sessionsService: SessionsService) { }

    @hasRoles(JwtRole.DIRECTOR, JwtRole.ADMIN) // PTOTECCION DE RUTAS por rol
    @UseGuards(JwtAuthGuard, JwtRolesGuard) // PTOTECCION DE RUTAS token obligado
    @Post('create') // http://localhost:3000/sessions/create
    create(@Body() createSessionDto: CreateSessionDto) {
        return this.sessionsService.create(createSessionDto);
    }

    @hasRoles(JwtRole.DIRECTOR, JwtRole.ADMIN, JwtRole.SECRETARY) // PTOTECCION DE RUTAS por rol
    @UseGuards(JwtAuthGuard, JwtRolesGuard) // PTOTECCION DE RUTAS token obligado
    @Get()
    findAll(@Query() filter: FilterSessionDto) {
        return this.sessionsService.findAll(filter);
    }

    @hasRoles(JwtRole.DIRECTOR, JwtRole.ADMIN) // PTOTECCION DE RUTAS por rol
    @UseGuards(JwtAuthGuard, JwtRolesGuard) // PTOTECCION DE RUTAS token obligado
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateSessionDto: UpdateSessionDto,
    ) {
        return this.sessionsService.update(id, updateSessionDto);
    }
}
