// src/subjects/entities/subject.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AcademicPeriod } from '../academic-periods/academic-period.entity';
import { SubjectType } from '../subjects/enums/subject-type.enum';
import { SubjectComponent } from '../subjects/enums/subject-component.enum';

@Entity('subjects')
export class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  code: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'smallint' })
  credits: number;

  @Column({ type: 'smallint' })
  semester: number;

  @Column({ type: 'smallint' })
  weekly_hours: number;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'enum', enum: SubjectType })
  type: SubjectType;

  @Column({ type: 'enum', enum: SubjectComponent })
  component: SubjectComponent;

  @ManyToOne(() => AcademicPeriod, period => period.subjects, { eager: true })
  @JoinColumn({ name: 'academic_period_id' }) // <--- esto fuerza el nombre
  academicPeriod: AcademicPeriod;

}
