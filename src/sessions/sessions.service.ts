import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
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
  ) { }

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

    await this.validateTeacherSessionConflicts(session.group.teacher.id, session);

    return this.sessionRepo.save(session);
  }

  // metodo principal que valida los conflictos de horarios
  async validateTeacherSessionConflicts(teacherId: number, extraSession?: Session): Promise<void> {
    const sessions = await this.sessionRepo.find({
      where: { group: { teacher: { id: teacherId } } },
      relations: ['group', 'group.subject'],
    });

    if (extraSession) {
      // Reemplazar la sesión existente con el mismo ID por extraSession
      const index = sessions.findIndex(s => s.id === extraSession.id);
      if (index !== -1) {
        sessions[index] = extraSession;
      } else {
        sessions.push(extraSession);
      }
    }

    for (let i = 0; i < sessions.length; i++) {
      for (let j = i + 1; j < sessions.length; j++) {
        const sessionA = sessions[i];
        const sessionB = sessions[j];

        // Compare only if it's the same day
        if (sessionA.day_of_week === sessionB.day_of_week) {

          console.log(`Comparing sessions: ${sessionA.id} and ${sessionB.id}`);

          const sessionAStart = this.timeStringToMinutes(sessionA.start_time);
          const sessionAEnd = sessionAStart + (sessionA.duration_hours * 60);

          const sessionBStart = this.timeStringToMinutes(sessionB.start_time);
          const sessionBEnd = sessionBStart + (sessionB.duration_hours * 60);

          const overlap = sessionAStart < sessionBEnd && sessionBStart < sessionAEnd;


          if (overlap) {
            throw new HttpException(`Schedule conflict detected:
  Session A [ID: ${sessionA.id ?? 'unsaved'}] (Group ID: ${sessionA.group?.id ?? 'unknown'}, Subject ID: ${sessionA.group?.subject?.id ?? 'unknown'})
  overlaps with
  Session B [ID: ${sessionB.id ?? 'unsaved'}] (Group ID: ${sessionB.group?.id ?? 'unknown'}, Subject ID: ${sessionB.group?.subject?.id ?? 'unknown'})
`, HttpStatus.BAD_REQUEST); //400
          }
        }
      }
    }
  }

  // Helper to convert "HH:MM:SS" to minutes
  private timeStringToMinutes(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }

}
