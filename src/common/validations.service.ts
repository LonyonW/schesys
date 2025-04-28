import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from 'src/sessions/session.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ValidationsService {
    constructor(
        @InjectRepository(Session)
        private sessionRepo: Repository<Session>,
    ) { }

    // validar que acepte valores nulos en las sesiones excepto group_id y su propio id
    async validateTeacherSessionConflicts(teacherId: number, extraSession?: Session, newGroupId?: number): Promise<void> {
        const sessions = await this.sessionRepo.find({
            where: { group: { teacher: { id: teacherId } } },
            relations: ['group', 'group.subject'],
        });

        if (newGroupId) {
            const newGroupSessions = await this.sessionRepo.find({
                where: { group: { id: newGroupId } },
                relations: ['group', 'group.subject'],
            });
            // Añade las sesiones del nuevo grupo al array de sesiones
            sessions.push(...newGroupSessions);
        }

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
                    // Verificar que ambas sesiones tengan start_time y duration_hours válidos
                    if (!sessionA.start_time || sessionA.duration_hours === null || 
                        !sessionB.start_time || sessionB.duration_hours === null) {
                        continue; // Ignorar esta comparación si falta algún dato
                    }

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

    async validateClassroomSessionConflicts(classroomId: number, extraSession?: Session): Promise<void> {
        const sessions = await this.sessionRepo.find({
            where: { classroom: { id: classroomId } },
            relations: ['group', 'classroom'],
        });

        if (extraSession) {
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

                if (sessionA.day_of_week === sessionB.day_of_week) {
                    // Verificar que ambas sesiones tengan start_time y duration_hours válidos
                    if (!sessionA.start_time || sessionA.duration_hours === null || 
                        !sessionB.start_time || sessionB.duration_hours === null) {
                        continue; // Ignorar esta comparación si falta algún dato
                    }

                    const sessionAStart = this.timeStringToMinutes(sessionA.start_time);
                    const sessionAEnd = sessionAStart + (sessionA.duration_hours * 60);

                    const sessionBStart = this.timeStringToMinutes(sessionB.start_time);
                    const sessionBEnd = sessionBStart + (sessionB.duration_hours * 60);

                    const overlap = sessionAStart < sessionBEnd && sessionBStart < sessionAEnd;

                    if (overlap) {
                        const conflictMessage = `Classroom schedule conflict detected:
Session A [ID: ${sessionA.id ?? 'unsaved'}] (Group ID: ${sessionA.group?.id ?? 'unknown'}, Classroom ID: ${sessionA.classroom?.id ?? 'unknown'})
overlaps with
Session B [ID: ${sessionB.id ?? 'unsaved'}] (Group ID: ${sessionB.group?.id ?? 'unknown'}, Classroom ID: ${sessionB.classroom?.id ?? 'unknown'})
`;
                        throw new HttpException(conflictMessage, HttpStatus.BAD_REQUEST);
                    }
                }
            }
        }
    }

    async validateSemesterSessionConflicts(semester: number, extraSession?: Session): Promise<void> {
        // Buscar todas las sesiones de materias que tengan el mismo semestre
        const sessions = await this.sessionRepo.find({
            where: { group: { subject: { semester } } },
            relations: ['group', 'group.subject', 'group.teacher', 'classroom'],
        });

        if (extraSession) {
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

                const subjectAId = sessionA.group?.subject?.id;
                const subjectBId = sessionB.group?.subject?.id;
                const groupAId = sessionA.group?.id;
                const groupBId = sessionB.group?.id;

                if (!subjectAId || !subjectBId || !groupAId || !groupBId) {
                    continue; // Datos incompletos, saltar
                }

                if (sessionA.day_of_week === sessionB.day_of_week) {
                    // Verificar que ambas sesiones tengan start_time y duration_hours válidos
                    if (!sessionA.start_time || sessionA.duration_hours === null || 
                        !sessionB.start_time || sessionB.duration_hours === null) {
                        continue; // Ignorar esta comparación si falta algún dato
                    }

                    const sessionAStart = this.timeStringToMinutes(sessionA.start_time);
                    const sessionAEnd = sessionAStart + (sessionA.duration_hours * 60);

                    const sessionBStart = this.timeStringToMinutes(sessionB.start_time);
                    const sessionBEnd = sessionBStart + (sessionB.duration_hours * 60);

                    const overlap = sessionAStart < sessionBEnd && sessionBStart < sessionAEnd;

                    if (overlap) {
                        // Validaciones especificas:

                        // 1.  Si pertenecen al mismo grupo: PROHIBIDO cruzar
                        if (groupAId === groupBId) {
                            throw new HttpException(`Conflict detected:
      Sessions from the SAME group [Group ID: ${groupAId}] are overlapping!
      Session A ID: ${sessionA.id ?? 'unsaved'} and Session B ID: ${sessionB.id ?? 'unsaved'}
      `, HttpStatus.BAD_REQUEST);
                        }

                        // 2.  Si pertenecen a diferentes materias pero mismo semestre: PROHIBIDO cruzar
                        if (subjectAId !== subjectBId) {
                            throw new HttpException(`Conflict detected:
      Sessions from DIFFERENT subjects (but same semester ${semester}) are overlapping!
      Session A [Subject ID: ${subjectAId}, Group ID: ${groupAId}]
      Session B [Subject ID: ${subjectBId}, Group ID: ${groupBId}]
      `, HttpStatus.BAD_REQUEST);
                        }

                        // 3. Si pertenecen a la misma materia pero grupos diferentes: PERMITIDO (nada que hacer)
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