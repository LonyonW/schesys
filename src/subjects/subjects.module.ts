import { Module } from '@nestjs/common';
import { SubjectsController } from './subjects.controller';
import { SubjectsService } from './subjects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcademicPeriod } from 'src/academic-periods/academic-period.entity';
import { Subject } from './subject.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subject, AcademicPeriod])],
  controllers: [SubjectsController],
  providers: [SubjectsService]
})
export class SubjectsModule {}
