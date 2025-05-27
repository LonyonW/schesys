import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from 'src/sessions/session.entity';
import { Group } from 'src/groups/group.entity';
import { Teacher } from 'src/teachers/teacher.entity';
import { MailerService } from '@nestjs-modules/mailer';
import * as fs from 'fs';
import * as path from 'path';
import { PdfService } from 'src/pdf/pdf.service';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepo: Repository<Session>,

    @InjectRepository(Group)
    private readonly groupRepo: Repository<Group>,

    @InjectRepository(Teacher)
    private readonly teacherRepo: Repository<Teacher>,

    private readonly mailerService: MailerService,

    private readonly pdfService: PdfService,
  ) {}

  async generateAndSendReports(): Promise<void> {
    const teachers = await this.teacherRepo.find();

    for (const teacher of teachers) {
      const sessions = await this.sessionRepo.find({
        where: { group: { teacher: { id: teacher.id } } },
        relations: ['group', 'group.subject', 'classroom'],
        order: { day_of_week: 'ASC', start_time: 'ASC' },
      });

      const pdfPath = await this.generatePDF(teacher, sessions);
      await this.sendEmailWithAttachment(teacher.institutional_email, pdfPath);
      fs.unlinkSync(pdfPath);
    }
  }

  private async generatePDF(teacher: Teacher, sessions: Session[]): Promise<string> {
    try {
      console.log('Iniciando generación de PDF con PdfService...');
      console.log('Datos del docente:', teacher);
      console.log('Sesiones:', sessions);

      const pdfBuffer = await this.pdfService.generateWeeklySchedulePdf(teacher, sessions);

      const filename = `schedule_${teacher.id}.pdf`;
      const dir = path.join(__dirname, '../../../tmp');

      if (!fs.existsSync(dir)) {
        console.log(`Creando directorio ${dir}`);
        fs.mkdirSync(dir, { recursive: true });
      }

      const filePath = path.join(dir, filename);
      await fs.promises.writeFile(filePath, pdfBuffer);

      console.log(`PDF generado en: ${filePath}`);
      return filePath;
    } catch (error) {
      console.error('Error en generatePDF:', error.message);
      throw error;
    }
  }

  private async sendEmailWithAttachment(email: string, filePath: string) {
    try {
      console.log(`Enviando email a ${email} con archivo ${filePath}`);
      await this.mailerService.sendMail({
        to: email,
        subject: 'Reporte de horario semanal',
        text: 'Adjunto encontrarás tu horario semanal de sesiones.',
        attachments: [
          {
            filename: path.basename(filePath),
            path: filePath,
          },
        ],
      });
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
      const pdfPath = await this.generatePDF(teacher, sessions);

      console.log(`Enviando email al docente ${teacherId} (${teacher.institutional_email})`);
      await this.sendEmailWithAttachment(teacher.institutional_email, pdfPath);

      console.log(`Eliminando archivo temporal: ${pdfPath}`);
      fs.unlinkSync(pdfPath);
    } catch (error) {
      console.error('Error en generateAndSendReportForTeacher:', error.message);
      throw error;
    }
  }
}