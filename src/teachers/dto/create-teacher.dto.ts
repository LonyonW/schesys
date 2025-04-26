import { IsString, IsEmail, IsBoolean, IsOptional, IsInt } from 'class-validator';

export class CreateTeacherDto {
  @IsString()
  fullName: string;

  @IsEmail()
  institutionalEmail: string;

  @IsString()
  gender: string;

  @IsString()
  academicLevel: string;

  @IsInt()
  contractTypeId: number;

  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsString()
  availability?: string;
}
