// src/periodos/entities/periodo-academico.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
//import { Materia } from 'src/materias/entities/materia.entity';

@Entity({ name: 'academic_periods' })
export class AcademicPeriod {


  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  name: string; // Ej: 2025-1

  @Column({ type: 'text', nullable: true })
  aditional_info: string;

  @Column({ default: true })
  is_active: boolean;

  //@OneToMany(() => Materia, materia => materia.periodoAcademico)
  //materias: Materia[];
}
