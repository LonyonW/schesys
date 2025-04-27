import { IsEnum, IsOptional, IsString, IsInt, IsPositive } from 'class-validator';
import { Weekday } from '../enums/session-weekday.enum';

export class CreateSessionDto {
  @IsInt()
  group_id: number;

  @IsOptional()
  @IsInt()
  classroom_id?: number;

  @IsEnum(Weekday)
  day_of_week: Weekday;

  @IsString()
  start_time: string; // Expect 'HH:mm' or 'HH:mm:ss'

  @IsInt()
  @IsPositive()
  duration_hours: number;
}
