import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subject } from './subject.entity';
import { Repository } from 'typeorm';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { AcademicPeriod } from 'src/academic-periods/academic-period.entity';

@Injectable()
export class SubjectsService {

    constructor(
        @InjectRepository(Subject) private subjectRepo: Repository<Subject>,
        @InjectRepository(AcademicPeriod) private periodRepo: Repository<AcademicPeriod>,
    ) { }


    async create(data: CreateSubjectDto): Promise<Subject> {
        const period = await this.periodRepo.findOneBy({ id: data.academic_period_id });

        const codeExists = await this.subjectRepo.findOneBy({ code: data.code });
        

        if (!period) {
            throw new HttpException('Periods related not found', HttpStatus.NOT_FOUND); //404
        }

        if (codeExists) {
            throw new HttpException('Code already exists', HttpStatus.CONFLICT); // 409
        } 



        const subject = this.subjectRepo.create({
            code: data.code,
            name: data.name,
            credits: data.credits,
            semester: data.semester,
            weekly_hours: data.weekly_hours,
            is_active: data.is_active,
            academicPeriod: period,
            type: data.type,
            component: data.component,
        });

        return this.subjectRepo.save(subject);
    }


}
