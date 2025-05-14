
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsInt } from 'class-validator';

export class FilterGroupDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  subject_id?: number;

  @IsOptional()
  @IsString()
  subject_code?: string;
}
