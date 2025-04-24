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
      template: 'reset-password', // nombre del archivo template .hbs
      context: {
        url: resetLink,
      },
    });
  }
}
