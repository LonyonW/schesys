import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

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

    @IsOptional()
    @IsBoolean()
    is_active?: boolean;
}