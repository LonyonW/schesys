import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterAuthDto {

    // validaciones usando class-validator y class-transformer

    @IsString()
    @IsNotEmpty()
    first_name: string;

    @IsString()
    @IsNotEmpty()
    last_name: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6, {message: 'Password is too short. Minimal length is 6 characters'})
    password: string;

    @IsNotEmpty()
    is_active: boolean;


    @IsNotEmpty()
    rolesIds: string[]; // array of roles ids
}