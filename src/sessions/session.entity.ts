import { Classroom } from 'src/classrooms/classroom.entity';
import { Group } from 'src/groups/group.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Weekday } from './enums/session-weekday.enum';



@Entity({ name: 'sessions' })
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Group, (group) => group.sessions)
  @JoinColumn({ name: 'group_id' }) 
  group: Group;

  @ManyToOne(() => Classroom, { nullable: true })
  @JoinColumn({ name: 'classroom_id' }) 
  classroom: Classroom;

  @Column({
    type: 'enum',
    enum: Weekday,
  })
  day_of_week: Weekday;

  @Column({ type: 'time' })
  start_time: string; // Format 'HH:mm:ss'

  @Column({ type: 'smallint' })
  duration_hours: number;
}
