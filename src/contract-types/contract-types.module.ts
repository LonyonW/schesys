import { Module } from '@nestjs/common';
import { ContractTypesController } from './contract-types.controller';
import { ContractTypesService } from './contract-types.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractType } from './contract-type.entity';
import { Teacher } from 'src/teachers/teacher.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContractType, Teacher])],
  controllers: [ContractTypesController],
  providers: [ContractTypesService]
})
export class ContractTypesModule {}
