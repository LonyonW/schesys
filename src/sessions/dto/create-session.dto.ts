import { IsEnum, IsOptional, IsString, IsInt, IsPositive, Matches, Validate } from 'class-validator';
import { Weekday } from '../enums/session-weekday.enum';
import { IsWithinWorkingHoursString } from 'src/common/is-within-working-hours-string.validator';

export class CreateSessionDto {
  @IsInt()
  group_id: number;

  @IsOptional()
  @IsInt()
  classroom_id?: number;

  @IsEnum(Weekday)
  day_of_week: Weekday;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, {
    message: 'start_time debe estar en formato HH:mm o HH:mm:ss',
  })
  @Validate(IsWithinWorkingHoursString)
  start_time: string; // Expect 'HH:mm' or 'HH:mm:ss'

  @IsInt()
  @IsPositive()
  duration_hours: number;
}
