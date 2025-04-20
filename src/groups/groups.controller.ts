import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { GroupsService } from './groups.service';
import { hasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-role';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';

@Controller('groups')
export class GroupsController {
    constructor(private readonly groupsService: GroupsService) { }


    @hasRoles(JwtRole.ADMIN, JwtRole.DIRECTOR) // PTOTECCION DE RUTAS por rol
    @UseGuards(JwtAuthGuard, JwtRolesGuard) // PTOTECCION DE RUTAS token obligado
    @Post('create') // http://localhost:3000/groups/create -> POST
    async create(@Body() dto: CreateGroupDto) {
        return this.groupsService.create(dto);
    }
}
