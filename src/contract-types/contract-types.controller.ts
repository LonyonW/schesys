import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ContractTypesService } from './contract-types.service';
import { CreateContractTypeDto } from './dto/create-contract-type.dto';
import { hasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-role';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';

@Controller('contract-types')
export class ContractTypesController {
  constructor(private readonly contractTypesService: ContractTypesService) {}

  @hasRoles(JwtRole.DIRECTOR, JwtRole.ADMIN) // PTOTECCION DE RUTAS por rol
  @UseGuards(JwtAuthGuard, JwtRolesGuard) // PTOTECCION DE RUTAS token obligado
  @Post('create')
  create(@Body() data: CreateContractTypeDto) {
    return this.contractTypesService.create(data);
  }


  @hasRoles(JwtRole.DIRECTOR, JwtRole.ADMIN) // PTOTECCION DE RUTAS por rol
  @UseGuards(JwtAuthGuard, JwtRolesGuard) // PTOTECCION DE RUTAS token obligado
  @Get()
  findAll() {
    return this.contractTypesService.findAll();
  }
}
