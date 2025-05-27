import { IsOptional, IsString, IsNumber } from 'class-validator';

export class FilterClassroomDto {

  @IsOptional()
  @IsString()
  id?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  capacity?: number;
}
