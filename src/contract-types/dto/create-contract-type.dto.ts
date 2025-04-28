import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateContractTypeDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  contract_resolution?: string;

  @IsInt()
  max_hours: number;
}
