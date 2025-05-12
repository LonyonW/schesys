import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subject } from './subject.entity';
import { ILike, Repository } from 'typeorm';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { AcademicPeriod } from 'src/academic-periods/academic-period.entity';
import { FilterSubjectDto } from './dto/filter-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectsService {

    constructor(
        @InjectRepository(Subject) private subjectRepo: Repository<Subject>,
        @InjectRepository(AcademicPeriod) private periodRepo: Repository<AcademicPeriod>,
    ) { }


    async create(data: CreateSubjectDto): Promise<Subject> {

        const codeExists = await this.subjectRepo.findOneBy({ code: data.code });


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
            type: data.type,
            component: data.component,
        });

        return this.subjectRepo.save(subject);
    }

    async searchSubjects(filter: FilterSubjectDto): Promise<Subject[]> {
        const where: any = {};

        if (filter.code) {
            where.code = filter.code;
        }

        if (filter.name) {
            where.name = ILike(`%${filter.name}%`); // para buscar por nombre
        }

        if (filter.semester) {
            where.semester = ILike(`%${filter.semester}%`); // para buscar por semestre
        }

        return this.subjectRepo.find({ where });
    }


    async update(id: number, data: UpdateSubjectDto): Promise<Subject> {
        const subject = await this.subjectRepo.findOneBy({ id });

        if (!subject) {
            throw new HttpException('Subject not found', HttpStatus.NOT_FOUND); //404
        }

        // Validar cambios críticos si ya hay grupos/sesiones (opcional avanzado)
        // Ej: Si tiene grupos asignados no permitir cambio de weekly_hours

        if (data.code) {
            const conflict = await this.subjectRepo.findOne({ where: { code: data.code } });
            if (conflict && conflict.id !== id) {
                throw new ConflictException('Another subject already uses this code'); // 409 conflict
            }
            subject.code = data.code;
        }

        if (data.name !== undefined) subject.name = data.name;
        if (data.credits !== undefined) subject.credits = data.credits;
        if (data.semester !== undefined) subject.semester = data.semester;
        if (data.weekly_hours !== undefined) subject.weekly_hours = data.weekly_hours;
        if (data.type !== undefined) subject.type = data.type;
        if (data.component !== undefined) subject.component = data.component;
        if (data.is_active !== undefined) subject.is_active = data.is_active;

        const updatedPeriod = Object.assign(subject, data);
        return this.subjectRepo.save(updatedPeriod);
    }



}
