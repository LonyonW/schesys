import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          //user: process.env.MAIL_USER, 
          //pass: process.env.MAIL_PASS,
          user: 'pkpzimba486@gmail.com', 
          pass: 'saypvfgitouvgzle',
        },
      },
      defaults: {
        from: '"Schesys App" <no-reply@schesys.com>',
      },
      template: {
        //dir: __dirname + '/mail/templates',
        //dir: join(__dirname, 'templates'),
        dir: join(process.cwd(), 'src', 'mail', 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}
