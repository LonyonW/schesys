import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    first_name?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    last_name?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    email?: string;

    //password?: string;

    @IsOptional()
    @IsNotEmpty()
    is_active?: boolean;
}