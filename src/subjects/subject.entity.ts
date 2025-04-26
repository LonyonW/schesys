// src/subjects/entities/subject.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { AcademicPeriod } from '../academic-periods/academic-period.entity';
import { SubjectType } from '../subjects/enums/subject-type.enum';
import { SubjectComponent } from '../subjects/enums/subject-component.enum';
import { Group } from 'src/groups/group.entity';

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

  // A subject can belong to many academic periods, and vice versa
  @ManyToMany(() => AcademicPeriod, period => period.subjects)
  @JoinTable({
    name: 'subject_academic_period', // nombre de la tabla intermedia
    joinColumn: { name: 'subject_id' },
    inverseJoinColumn: { name: 'academic_period_id' },
  })
  academicPeriods: AcademicPeriod[];


  @OneToMany(() => Group, group => group.subject)
  groups: Group[];

}
