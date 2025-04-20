
import { IsOptional, IsString } from 'class-validator';

export class FilterSubjectDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  name?: string;
}
