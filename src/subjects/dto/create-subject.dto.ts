
import {
    IsString,
    IsNotEmpty,
    IsInt,
    Min,
    Max,
    IsBoolean,
    IsEnum,
  } from 'class-validator';
import { SubjectType } from '../enums/subject-type.enum';
import { SubjectComponent } from '../enums/subject-component.enum';
  
  export class CreateSubjectDto {
    @IsString()
    @IsNotEmpty()
    code: string;
  
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @IsInt()
    @Min(1)
    @Max(10)
    credits: number;
  
    @IsInt()
    @Min(1)
    semester: number;
  
    @IsInt()
    weekly_hours: number;
  
    @IsBoolean()
    is_active: boolean;
  
    @IsInt()
    academic_period_id: number;
  
    @IsEnum(SubjectType)
    type: SubjectType;

    @IsEnum(SubjectComponent)
    component: SubjectComponent;

  }
  