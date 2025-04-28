import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './session.entity';
import { Group } from 'src/groups/group.entity';
import { Classroom } from 'src/classrooms/classroom.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { FilterSessionDto } from './dto/filter-session.dto';
import { ValidationsService } from 'src/common/validations.service';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private sessionRepo: Repository<Session>,

    @InjectRepository(Group)
    private groupRepo: Repository<Group>,

    @InjectRepository(Classroom)
    private classroomRepo: Repository<Classroom>,

    private readonly validationsService: ValidationsService,
  ) { }

  async create(data: CreateSessionDto): Promise<Session> {
    const group = await this.groupRepo.findOne({ where: { id: data.group_id }, relations: ['teacher', 'subject'] });
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

    if (group.teacher) {
      await this.validationsService.validateTeacherSessionConflicts(group.teacher.id, newSession);
    }
  
    if (classroom) {
      await this.validationsService.validateClassroomSessionConflicts(classroom.id, newSession);
    }

    await this.validationsService.validateSemesterSessionConflicts(group.subject.semester, newSession);

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
    const session = await this.sessionRepo.findOne({ where: { id }, relations: ['group', 'group.teacher', 'group.subject', 'classroom'] });
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

    // --- Validaciones específicas del requisito RF026 ---
    // Validar hora de inicio (6:00 am a 8:00 pm)
    if (data.start_time) {
      const [hours, minutes] = data.start_time.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes;
      const minMinutes = 6 * 60;   // 6:00 am
      const maxMinutes = 20 * 60;  // 8:00 pm

      if (totalMinutes < minMinutes || totalMinutes > maxMinutes) {
        throw new HttpException('Start time must be between 06:00 AM and 08:00 PM', HttpStatus.BAD_REQUEST); //400
      }
      session.start_time = data.start_time;
    }

    if (!session.group.teacher) {
      const fullGroup = await this.groupRepo.findOne({
        where: { id: session.group.id },
        relations: ['teacher'],
      });
      session.group.teacher = fullGroup.teacher;
    }



    session.day_of_week = data.day_of_week ?? session.day_of_week;
    session.start_time = data.start_time ?? session.start_time;
    session.duration_hours = data.duration_hours ?? session.duration_hours;

    await this.validationsService.validateTeacherSessionConflicts(session.group.teacher.id, session);

    await this.validationsService.validateClassroomSessionConflicts(session.classroom?.id, session);

    await this.validationsService.validateSemesterSessionConflicts(session.group.subject.semester, session);



    return this.sessionRepo.save(session);
  }

}
