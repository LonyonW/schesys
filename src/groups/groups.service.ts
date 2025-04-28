// src/groups/groups.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { Group } from './group.entity';
import { Subject } from 'src/subjects/subject.entity';
import { ILike } from 'typeorm';
import { FilterGroupDto } from './dto/filter-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AssignTeacherDto } from './dto/assign-teacher.dto';
import { Teacher } from 'src/teachers/teacher.entity';
import { Session } from 'src/sessions/session.entity';
import { ValidationsService } from 'src/common/validations.service';

@Injectable()
export class GroupsService {
    constructor(
        @InjectRepository(Group)
        private groupRepo: Repository<Group>,

        @InjectRepository(Subject)
        private subjectRepo: Repository<Subject>,

        @InjectRepository(Teacher)
        private readonly teacherRepo: Repository<Teacher>,

        @InjectRepository(Session)
        private readonly sessionRepo: Repository<Session>,

        private readonly validationsService: ValidationsService,
    ) { }

    async create(dto: CreateGroupDto): Promise<Group> {
        const subject = await this.subjectRepo.findOneBy({ id: dto.subject_id });

        const groupExists = await this.groupRepo.findOneBy({ code: dto.code });

        if (!subject) {
            throw new HttpException('Subject not found', HttpStatus.NOT_FOUND); //404
        }

        if (groupExists) {
            throw new HttpException('Group already exists', HttpStatus.BAD_REQUEST); //400
        }


        const group = this.groupRepo.create({
            code: dto.code,
            number: dto.number,
            capacity: dto.capacity,
            is_active: dto.is_active,
            comments: dto.comments,
            subject: subject,
        });

        const savedGroup = await this.groupRepo.save(group);

        // Calcular sesiones basadas en weekly_hours
        if (subject.weekly_hours) {
            let hoursRemaining = subject.weekly_hours;
        
            while (hoursRemaining > 0) {
              const sessionDuration = hoursRemaining >= 2 ? 2 : hoursRemaining; // Última sesión puede ser menos de 2h
              const session = this.sessionRepo.create({
                group: savedGroup,
                day_of_week: null, // El frontend lo edita después
                start_time: null,
                duration_hours: sessionDuration,
              });
              await this.sessionRepo.save(session);
              hoursRemaining -= sessionDuration;
            }
          }

        return savedGroup;

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
            relations: ['subject', 'teacher'], // para obtener todo lo que contiene la relacion
        });
    }

    async update(id: number, data: UpdateGroupDto): Promise<Group> {
        const group = await this.groupRepo.findOneBy({ id });

        if (!group) {
            throw new HttpException('Subject not found', HttpStatus.NOT_FOUND); //404
        }

        // ⚠️ Validación: si tiene sesiones, no permitir reducción de capacidad

        /*
        if (data.capacity !== undefined && group.sessions?.length > 0) {
            if (data.capacity < group.capacity) {
                throw new BadRequestException('Cannot reduce capacity: group has assigned sessions');
            }
        }
        */

        if (data.capacity !== undefined) group.capacity = data.capacity;
        if (data.is_active !== undefined) group.is_active = data.is_active;
        if (data.weekly_sessions !== undefined) {
            // Si usas weekly_sessions como atributo directo
            (group as any).weekly_sessions = data.weekly_sessions;
        }


        

        const updatedGroup = Object.assign(group, data);
        return this.groupRepo.save(updatedGroup); // REVISAR ESTO
    }


    async assignTeacher(groupId: number, data: AssignTeacherDto): Promise<Group> {
        const group = await this.groupRepo.findOne({ where: { id: groupId } });

        
        if (!group) {
            throw new HttpException('Group not found', HttpStatus.NOT_FOUND); //404
        }




        const teacher = await this.teacherRepo.findOne({
            where: { id: data.teacher_id },
            relations: ['contract_type'],
        });

        if (!teacher) {
            throw new HttpException('Teacher not found', HttpStatus.NOT_FOUND); //404
        }

        const teacherGroups = await this.groupRepo.find({
            where: { teacher: { id: data.teacher_id } },
            relations: ['sessions'], // necesitamos sessions
        });

        let totalHours = 0;
        for (const tg of teacherGroups) {
            for (const session of tg.sessions) {
                totalHours += session.duration_hours;
            }
        }

        // Ahora consultamos las sesiones del grupo nuevo también (opcional si quieres contar el nuevo grupo)
        const newGroupSessions = await this.sessionRepo.find({
            where: { group: { id: groupId } },
        });

        for (const session of newGroupSessions) {
            totalHours += session.duration_hours;
        }


        const maxHours = teacher.contract_type.max_hours;

        if (totalHours > maxHours) {
            throw new HttpException(`Teacher exceeds allowed hours: ${totalHours}/${maxHours} hours`, HttpStatus.BAD_REQUEST); //400
        }

        group.teacher = teacher; // Relación directa

        await this.validationsService.validateTeacherSessionConflicts(teacher.id, undefined, groupId);

        return this.groupRepo.save(group);
    }



}
