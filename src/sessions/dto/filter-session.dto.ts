import { Type } from 'class-transformer';
import { IsOptional, IsInt } from 'class-validator';

export class FilterSessionDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  group_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  classroom_id?: number;
}
