import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ResetPasswordDto {

    @IsString()
    @IsNotEmpty()
    token: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6, {message: 'Password is too short. Minimal length is 6 characters'})
    new_password: string;
  }
  