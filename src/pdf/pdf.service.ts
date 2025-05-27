import { Injectable } from '@nestjs/common';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { Session } from 'src/sessions/session.entity';
import { Teacher } from 'src/teachers/teacher.entity';

(pdfMake as any).vfs = (pdfFonts as any).vfs;

@Injectable()
export class PdfService {
  async generateWeeklySchedulePdf(teacher: Teacher, sessions: Session[]): Promise<Buffer> {
    try {
      console.log('Generando PDF con pdfmake...');
      console.log('Datos del docente:', teacher);
      console.log('Sesiones:', sessions);

      if (!teacher || !teacher.full_name) {
        throw new Error('El docente o su nombre no están definidos');
      }

      const tableBody = [
        ['Día', 'Hora Inicio', 'Duración', 'Materia', 'Grupo', 'Aula'],
        ...sessions.map((session, index) => {
          if (!session.group || !session.group.subject || !session.group.subject.name) {
            console.error(`Error en la sesión ${index}: group o subject no están definidos`, session);
            throw new Error(`Datos incompletos en la sesión ${index}: group o subject no están definidos`);
          }
          return [
            session.day_of_week ?? 'N/A',
            session.start_time ?? 'N/A',
            `${session.duration_hours ?? 0} h`,
            session.group.subject.name,
            session.group.code ?? 'N/A',
            session.classroom?.name ?? 'N/A',
          ];
        }),
      ];

      const docDefinition: TDocumentDefinitions = {
        content: [
          { text: `Horario semanal de ${teacher.full_name}`, style: 'header' },
          { table: { body: tableBody } },
        ],
        styles: {
          header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
        },
      };

      console.log('Creando PDF con pdfmake...');
      return new Promise((resolve, reject) => {
        const pdfDocGenerator = pdfMake.createPdf(docDefinition);
        pdfDocGenerator.getBuffer((buffer: Buffer) => {
          if (!buffer) {
            const error = new Error('No se pudo generar el buffer del PDF');
            console.error('Error al generar PDF con pdfmake:', error.message);
            reject(error);
            return;
          }
          console.log('PDF generado exitosamente, buffer recibido');
          resolve(buffer);
        });
      });
    } catch (error) {
      console.error('Error en generateWeeklySchedulePdf:', error.message);
      throw error;
    }
  }
}