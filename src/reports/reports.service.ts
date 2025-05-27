import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from 'src/sessions/session.entity';
import { Group } from 'src/groups/group.entity';
import { Teacher } from 'src/teachers/teacher.entity';
import { PdfService } from 'src/pdf/pdf.service';
import { MailService } from 'src/mail/mail.service';


@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepo: Repository<Session>,

    @InjectRepository(Group)
    private readonly groupRepo: Repository<Group>,

    @InjectRepository(Teacher)
    private readonly teacherRepo: Repository<Teacher>,

    private readonly pdfService: PdfService,

    private readonly mailService: MailService, // Inyecta MailService
  ) {}

  async generateAndSendReports(): Promise<void> {
    const teachers = await this.teacherRepo.find();

    for (const teacher of teachers) {
      const sessions = await this.sessionRepo.find({
        where: { group: { teacher: { id: teacher.id } } },
        relations: ['group', 'group.subject', 'classroom'],
        order: { day_of_week: 'ASC', start_time: 'ASC' },
      });

      const pdfBuffer = await this.generatePDF(teacher, sessions);
      await this.sendEmailWithAttachment(teacher.institutional_email, pdfBuffer);
    }
  }

  private async generatePDF(teacher: Teacher, sessions: Session[]): Promise<Buffer> {
    try {
      console.log('Iniciando generación de PDF con PdfService...');
      console.log('Datos del docente:', teacher);
      console.log('Sesiones:', sessions);

      const pdfBuffer = await this.pdfService.generateWeeklySchedulePdf(teacher, sessions);

      console.log('PDF generado exitosamente como buffer');
      return pdfBuffer;
    } catch (error) {
      console.error('Error en generatePDF:', error.message);
      throw error;
    }
  }

  private async sendEmailWithAttachment(email: string, pdfBuffer: Buffer) {
    try {
      console.log(`Enviando email a ${email} con archivo adjunto`);
      await this.mailService.sendScheduleReportEmail(email, pdfBuffer);
      console.log(`Email enviado exitosamente a ${email}`);
    } catch (error) {
      console.error(`Error al enviar email a ${email}:`, error.message);
      throw error;
    }
  }

  async generateAndSendReportForTeacher(teacherId: number): Promise<void> {
    try {
      console.log(`Buscando docente con ID ${teacherId}`);
      const teacher = await this.teacherRepo.findOne({ where: { id: teacherId } });

      if (!teacher) {
        console.log(`Docente con ID ${teacherId} no encontrado`);
        throw new Error(`No se encontró al docente con ID ${teacherId}`);
      }

      console.log(`Buscando sesiones para el docente ${teacherId}`);
      const sessions = await this.sessionRepo.find({
        where: { group: { teacher: { id: teacher.id } } },
        relations: ['group', 'group.subject', 'classroom'],
        order: { day_of_week: 'ASC', start_time: 'ASC' },
      });

      console.log(`Generando PDF para el docente ${teacherId}`);
      const pdfBuffer = await this.generatePDF(teacher, sessions);

      console.log(`Enviando email al docente ${teacherId} (${teacher.institutional_email})`);
      await this.sendEmailWithAttachment(teacher.institutional_email, pdfBuffer);
    } catch (error) {
      console.error('Error en generateAndSendReportForTeacher:', error.message);
      throw error;
    }
  }
}