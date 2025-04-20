// src/academic-periods/dto/update-academic-period.dto.ts
import { IsOptional, IsBoolean, IsString, IsNotEmpty, Matches } from 'class-validator';
//import { Transform } from 'class-transformer';

export class UpdateAcademicPeriodDto {

  @IsOptional()
  @IsNotEmpty()
  @IsString() 
  @Matches(/^\d{4}-[1-2]$/, { message: 'Formato inválido. Ejemplo válido: 2025-1' })
  name?: string;
  

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  aditional_info?: string;

  @IsOptional()
  //@Transform(({ value }) => value === 'true')
  @IsBoolean()
  is_active?: boolean;
}
