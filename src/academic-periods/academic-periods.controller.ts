import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AcademicPeriodsService } from './academic-periods.service';
import { hasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-role';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
import { CreateAcademicPeriodDto } from './dto/create-academic-period.dto';

@Controller('academic-periods')
export class AcademicPeriodsController {

    constructor(private periodsService: AcademicPeriodsService) {}

    @hasRoles(JwtRole.DIRECTOR) // PTOTECCION DE RUTAS por rol
    @UseGuards(JwtAuthGuard, JwtRolesGuard) // PTOTECCION DE RUTAS token obligado
    @Post('register') // http://localhost:3000/academic-periods/register -> POST
    register(@Body() academicPeriod: CreateAcademicPeriodDto) {
        return this.periodsService.create(academicPeriod);
    }
}
