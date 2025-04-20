

import { IsString, IsNotEmpty, IsInt, Min, Max, IsOptional, IsBoolean } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsInt()
  @Min(1)
  number: number;

  @IsInt()
  @Min(1)
  @Max(100)
  capacity: number;

  @IsBoolean()
  is_active: boolean;

  @IsOptional()
  @IsString()
  comments?: string;

  @IsInt()
  subject_id: number;
}
