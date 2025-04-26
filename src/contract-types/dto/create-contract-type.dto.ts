import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateContractTypeDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  contractResolution?: string;

  @IsInt()
  maxHours: number;
}
