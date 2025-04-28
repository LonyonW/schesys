import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

//import { Teacher } from 'src/teachers/entities/teacher.entity'; // Opcional si usas relación con docente
import { Subject } from 'src/subjects/subject.entity';
import { Session } from 'src/sessions/session.entity';
import { Teacher } from 'src/teachers/teacher.entity';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column({ type: 'smallint' })
  number: number;

  @Column({ default: 20, type: 'smallint' })
  capacity: number;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'text', nullable: true })
  comments: string;

  @ManyToOne(() => Subject, subject => subject.groups)
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @OneToMany(() => Session, session => session.group)
    sessions: Session[];


  @ManyToOne(() => Teacher, teacher => teacher.groups, { nullable: true })
  @JoinColumn({ name: 'teacher_id' })
  teacher: Teacher;

  @Column({ name: 'teacher_id', nullable: true })
  teacher_id: number;


}
