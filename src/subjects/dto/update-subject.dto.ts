// src/subjects/dto/update-subject.dto.ts
import { IsOptional, IsString, IsEnum, IsInt, IsBoolean, Min, Max } from 'class-validator';
import { SubjectType } from '../enums/subject-type.enum';
import { SubjectComponent } from '../enums/subject-component.enum';

export class UpdateSubjectDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  credits?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  semester?: number;

  @IsOptional()
  @IsInt()
  weekly_hours?: number;

  @IsOptional()
  @IsEnum(SubjectType)
  type?: SubjectType;

  @IsOptional()
  @IsEnum(SubjectComponent)
  component?: SubjectComponent;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
