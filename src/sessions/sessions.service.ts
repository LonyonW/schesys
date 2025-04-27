import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './session.entity';
import { Group } from 'src/groups/group.entity';
import { Classroom } from 'src/classrooms/classroom.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { FilterSessionDto } from './dto/filter-session.dto';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private sessionRepo: Repository<Session>,

    @InjectRepository(Group)
    private groupRepo: Repository<Group>,

    @InjectRepository(Classroom)
    private classroomRepo: Repository<Classroom>,
  ) {}

  async create(data: CreateSessionDto): Promise<Session> {
    const group = await this.groupRepo.findOne({ where: { id: data.group_id } });
    if (!group) throw new NotFoundException('Group not found');

    let classroom = null;
    if (data.classroom_id) {
      classroom = await this.classroomRepo.findOne({ where: { id: data.classroom_id } });
      if (!classroom) throw new NotFoundException('Classroom not found');
    }

    const newSession = this.sessionRepo.create({
      group,
      classroom,
      day_of_week: data.day_of_week,
      start_time: data.start_time,
      duration_hours: data.duration_hours,
    });

    return this.sessionRepo.save(newSession);
  }

  async findAll(filter: FilterSessionDto): Promise<Session[]> {
    const where: any = {};

    if (filter.id !== undefined) {
      where.id = filter.id;
    }
    if (filter.group_id !== undefined) {
      where.group = { id: filter.group_id };
    }
    if (filter.classroom_id !== undefined) {
      where.classroom = { id: filter.classroom_id };
    }

    return this.sessionRepo.find({
      where,
      relations: ['group', 'classroom'],
    });
  }

  async update(id: number, data: UpdateSessionDto): Promise<Session> {
    const session = await this.sessionRepo.findOne({ where: { id }, relations: ['group', 'classroom'] });
    if (!session) throw new NotFoundException('Session not found');

    if (data.group_id) {
      const group = await this.groupRepo.findOne({ where: { id: data.group_id } });
      if (!group) throw new NotFoundException('Group not found');
      session.group = group;
    }

    if (data.classroom_id !== undefined) {
      if (data.classroom_id === null) {
        session.classroom = null;
      } else {
        const classroom = await this.classroomRepo.findOne({ where: { id: data.classroom_id } });
        if (!classroom) throw new NotFoundException('Classroom not found');
        session.classroom = classroom;
      }
    }

    session.day_of_week = data.day_of_week ?? session.day_of_week;
    session.start_time = data.start_time ?? session.start_time;
    session.duration_hours = data.duration_hours ?? session.duration_hours;

    return this.sessionRepo.save(session);
  }
}
