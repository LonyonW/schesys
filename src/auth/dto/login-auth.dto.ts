import { IsEmail, IsString, IsNotEmpty } from "class-validator";

export class LoginAuthDto {

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}