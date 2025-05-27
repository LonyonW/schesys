import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportController } from './reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from 'src/sessions/session.entity';
import { Group } from 'src/groups/group.entity';
import { Teacher } from 'src/teachers/teacher.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { PdfService } from 'src/pdf/pdf.service';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Session, Group, Teacher]),
    MailerModule,
  ],
  providers: [ReportsService, PdfService, MailService],
  controllers: [ReportController],
  exports: [ReportsService],
})
export class ReportModule {}
