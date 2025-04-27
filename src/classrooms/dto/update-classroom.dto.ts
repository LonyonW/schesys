import { IsOptional, IsString, IsBoolean, IsEnum, IsInt, Min } from 'class-validator';
import { ClassroomType } from '../enums/classroom-type.enum';

export class UpdateClassroomDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;

  @IsOptional()
  @IsEnum(ClassroomType, { message: 'Invalid classroom type' })
  type?: ClassroomType;

  @IsOptional()
  @IsString()
  additional_info?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
