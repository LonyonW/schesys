import { IsOptional, IsInt, Min, Max, IsBoolean } from 'class-validator';

export class UpdateGroupDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  capacity?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  weekly_sessions?: number; // si lo almacenas como atributo del grupo
}
