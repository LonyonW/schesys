import { IsInt } from 'class-validator';

export class AssignTeacherDto {
  @IsInt()
  teacher_id: number;
}
