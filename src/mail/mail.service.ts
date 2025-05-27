import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendResetEmail(email: string, resetLink: string) {
    console.log('Email destino:', email);
    await this.mailerService.sendMail({
      to: email,
      subject: 'Recuperación de contraseña',
      template: 'reset-password',
      context: {
        url: resetLink,
      },
    });
  }

  async sendScheduleReportEmail(email: string, pdfBuffer: Buffer) {
    try {
      console.log(`Enviando email a ${email} con archivo adjunto`);
      await this.mailerService.sendMail({
        to: email,
        subject: 'Reporte semanal de sesiones',
        template: 'weekly-schedule',
        context: {
          name: email.split('@')[0],
        },
        attachments: [
          {
            filename: 'horario-semanal.pdf',
            content: pdfBuffer,
          },
        ],
      });
      console.log(`Email enviado exitosamente a ${email}`);
    } catch (error) {
      console.error(`Error al enviar email a ${email}:`, error.message);
      throw error;
    }
  }
}