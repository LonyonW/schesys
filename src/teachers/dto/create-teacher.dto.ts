import { IsString, IsEmail, IsBoolean, IsOptional, IsInt } from 'class-validator';

export class CreateTeacherDto {
  @IsString()
  full_name: string;

  @IsEmail()
  institutional_email: string;

  @IsString()
  gender: string;

  @IsString()
  academic_level: string;

  @IsInt()
  contract_type_id: number;

  @IsBoolean()
  is_active: boolean;

  @IsOptional()
  @IsString()
  availability?: string;
}
