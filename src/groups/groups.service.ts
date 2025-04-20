// src/groups/groups.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { Group } from './group.entity';
import { Subject } from 'src/subjects/subject.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepo: Repository<Group>,

    @InjectRepository(Subject)
    private readonly subjectRepo: Repository<Subject>,
  ) {}

  async create(dto: CreateGroupDto): Promise<Group> {
    const subject = await this.subjectRepo.findOneBy({ id: dto.subject_id });

    if (!subject) {
      throw new HttpException('Subject not found', HttpStatus.NOT_FOUND); //404
    }

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
}
