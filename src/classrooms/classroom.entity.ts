import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ClassroomType } from './enums/classroom-type.enum';


@Entity('classrooms')
export class Classroom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  name: string; // Example: A-101, L-202

  @Column('int')
  capacity: number; // Maximum number of students

  @Column({ type: 'text', nullable: true })
  additional_info: string;

  @Column({
    type: 'enum',
    enum: ClassroomType,
  })
  type: ClassroomType; // Enum: theoretical, laboratory, auditorium, computer lab

  @Column({ default: true })
  is_active: boolean;
}
