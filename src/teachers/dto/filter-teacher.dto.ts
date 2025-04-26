// src/teachers/dto/filter-teacher.dto.ts
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class FilterTeacherDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  is_active?: boolean;
}
