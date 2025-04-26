import { Teacher } from 'src/teachers/teacher.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('contract_types')
export class ContractType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // Example: 'Full-time', 'Part-time'

  @Column({ type: 'text', nullable: true })
  contractResolution: string;

  @Column({ type: 'smallint' })
  maxHours: number; // Maximum allowed teaching hours

  @OneToMany(() => Teacher, teacher => teacher.contractType)
  teachers: Teacher[];
}
