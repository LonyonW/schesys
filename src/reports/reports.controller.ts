import { Controller, Post, Param, ParseIntPipe, HttpException, HttpStatus } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportsService) {}

  @Post('send-schedules')
  async sendSchedulesToAllTeachers() {
    await this.reportService.generateAndSendReports();
    return { message: 'Reportes enviados a todos los docentes.' };
  }

  @Post('send-schedule/:id')
  async sendScheduleToOneTeacher(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.reportService.generateAndSendReportForTeacher(id);
      return { message: `Reporte enviado al docente con ID ${id}.` };
    } catch (error) {
      console.error(`Error al enviar reporte al docente ${id}:`, error.message);
      throw new HttpException(
        `Error al enviar el reporte: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
