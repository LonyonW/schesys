import { IsOptional, IsInt, IsEnum, IsString, IsPositive } from 'class-validator';
import { Weekday } from '../enums/session-weekday.enum';

export class UpdateSessionDto {
    @IsOptional()
    @IsInt()
    group_id?: number;

    @IsOptional()
    @IsInt()
    classroom_id?: number;

    @IsOptional()
    @IsEnum(Weekday)
    day_of_week?: Weekday;

    @IsOptional()
    @IsString()
    start_time?: string; // Expect 'HH:mm' or 'HH:mm:ss'

    @IsOptional()
    @IsInt()
    @IsPositive()
    duration_hours?: number;

}
