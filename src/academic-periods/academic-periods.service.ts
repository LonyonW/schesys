import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AcademicPeriod } from './academic-period.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAcademicPeriodDto } from './dto/create-academic-period.dto';

@Injectable()
export class AcademicPeriodsService {
    constructor(
        @InjectRepository(AcademicPeriod) private periodsRepository: Repository<AcademicPeriod>,
    ) {}
    
    async create(academicPeriod: CreateAcademicPeriodDto) {

        const { name } = academicPeriod;

        const nameExists = await this.periodsRepository.findOneBy({ name });

        if (nameExists) {
                    throw new HttpException('This academic period already exists', HttpStatus.CONFLICT); // 409
                }
        
        const newAcademicPeriod = this.periodsRepository.create(academicPeriod);

        return this.periodsRepository.save(newAcademicPeriod);


    }

    async findPeriods(filter: { id?: string; is_active?: boolean }): Promise<AcademicPeriod[]> {
        const where: any = {};
    
        if (filter.id) {
          where.id = filter.id;
        }
    
        if (typeof filter.is_active === 'boolean') {
          where.is_active = filter.is_active;
        }
    
        return this.periodsRepository.find({ where });
    }
  


}
