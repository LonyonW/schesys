import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { ClassroomType } from '../enums/classroom-type.enum';

export class CreateClassroomDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(1)
  capacity: number;

  @IsOptional()
  @IsString()
  additional_info?: string;

  @IsEnum(ClassroomType)
  type: ClassroomType;

  @IsOptional()
  is_active?: boolean;
}
