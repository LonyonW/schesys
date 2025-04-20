// src/groups/groups.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { Group } from './group.entity';
import { Subject } from 'src/subjects/subject.entity';
import { ILike } from 'typeorm';
import { FilterGroupDto } from './dto/filter-group.dto';

@Injectable()
export class GroupsService {
    constructor(
        @InjectRepository(Group)
        private readonly groupRepo: Repository<Group>,

        @InjectRepository(Subject)
        private readonly subjectRepo: Repository<Subject>,
    ) { }

    async create(dto: CreateGroupDto): Promise<Group> {
        const subject = await this.subjectRepo.findOneBy({ id: dto.subject_id });

        //const groupExists = await this.groupRepo.findOneBy({ code: dto.code });

        if (!subject) {
            throw new HttpException('Subject not found', HttpStatus.NOT_FOUND); //404
        }

        //if (groupExists) {
            //throw new HttpException('Group already exists', HttpStatus.BAD_REQUEST); //400
        //}
        

        const group = this.groupRepo.create({
            code: dto.code,
            number: dto.number,
            capacity: dto.capacity,
            is_active: dto.is_active,
            comments: dto.comments,
            subject: subject,
        });

        return this.groupRepo.save(group);
    }



    async search(filter: FilterGroupDto): Promise<Group[]> {
        const where: any = {};

        if (filter.code) {
            where.code = ILike(`%${filter.code}%`);
        }

        if (filter.subject_id) {
            where.subject = { id: filter.subject_id };
        }

        if (filter.subject_code) {
            where.subject = { code: ILike(`%${filter.subject_code}%`) };
          }
          

        return this.groupRepo.find({
            where,
            relations: ['subject'], // para incluir datos de la materia
        });
    }

}
