import { Module } from '@nestjs/common';
import { AcademicPeriodsController } from './academic-periods.controller';
import { AcademicPeriodsService } from './academic-periods.service';
import { AcademicPeriod } from './academic-period.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AcademicPeriod])],
  controllers: [AcademicPeriodsController],
  providers: [AcademicPeriodsService]
})
export class AcademicPeriodsModule {}
