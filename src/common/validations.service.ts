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
