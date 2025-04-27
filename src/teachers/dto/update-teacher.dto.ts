// src/teachers/dto/update-teacher.dto.ts
import { IsOptional, IsString, IsBoolean, IsInt } from 'class-validator';

export class UpdateTeacherDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  institutional_email?: string;

  @IsOptional()
  @IsInt()
  contract_type_id?: number;

  @IsOptional()
  @IsString()
  academic_level?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
