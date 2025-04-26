// src/periodos/entities/periodo-academico.entity.ts
import { Subject } from 'src/subjects/subject.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

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

  @ManyToMany(() => Subject, subject => subject.academicPeriods)
  subjects: Subject[];

}
