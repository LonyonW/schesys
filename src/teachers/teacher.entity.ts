import { ContractType } from 'src/contract-types/contract-type.entity';
import { Group } from 'src/groups/group.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';

@Entity('teachers')
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  full_name: string;

  @Column({ length: 150, unique: true })
  institutional_email: string;

  @Column({ length: 1 })
  gender: string; // 'M' or 'F'

  @Column({ type: 'varchar', length: 50 })
  academic_level: string; // Example: 'Master', 'Doctorate'

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  availability: string;

  @ManyToOne(() => ContractType, contractType => contractType.teachers, { eager: true })
  contract_type: ContractType;
  groups: any;

  @OneToMany(() => Group, Group => Group.teacher)
      sessions: Group[];
}
