// src/periodos/dto/create-periodo-academico.dto.ts
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateAcademicPeriodDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-[1-2]$/, { message: 'Formato inválido. Ejemplo válido: 2025-1' })
  name: string;

  @IsString()
  @IsOptional()
  aditional_info?: string;

  //@IsBoolean() // seguro?
  @IsNotEmpty() 
  is_active: boolean;
}
