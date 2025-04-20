import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AcademicPeriodsService } from './academic-periods.service';
import { hasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-role';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
import { CreateAcademicPeriodDto } from './dto/create-academic-period.dto';
import { AcademicPeriod } from './academic-period.entity';
import { FilterAcademicPeriodDto } from './dto/filter-academic-period.dto';
import { UpdateAcademicPeriodDto } from './dto/update-academic-period.dto';

@Controller('academic-periods')
export class AcademicPeriodsController {

    constructor(private periodsService: AcademicPeriodsService) {}

    @hasRoles(JwtRole.DIRECTOR, JwtRole.ADMIN) // PTOTECCION DE RUTAS por rol
    @UseGuards(JwtAuthGuard, JwtRolesGuard) // PTOTECCION DE RUTAS token obligado
    @Post('register') // http://localhost:3000/academic-periods/register -> POST
    register(@Body() academicPeriod: CreateAcademicPeriodDto) {
        return this.periodsService.create(academicPeriod);
    }

    @hasRoles(JwtRole.DIRECTOR, JwtRole.ADMIN, JwtRole.SECRETARY) // PTOTECCION DE RUTAS por rol
    @UseGuards(JwtAuthGuard, JwtRolesGuard) // PTOTECCION DE RUTAS token obligado
    @Get()
    async getAll(@Query() filter: FilterAcademicPeriodDto): Promise<AcademicPeriod[]> {
    return this.periodsService.findPeriods(filter);
    }

    @hasRoles(JwtRole.DIRECTOR) // PTOTECCION DE RUTAS por rol
    @UseGuards(JwtAuthGuard, JwtRolesGuard) // PTOTECCION DE RUTAS token obligado
    @Put(':id') // http://localhost:3000/academic-periods/1 -> PATCH
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: UpdateAcademicPeriodDto,
        ) {
    return this.periodsService.update(id, data);
    }
}
