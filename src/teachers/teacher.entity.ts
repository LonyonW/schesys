import { ContractType } from 'src/contract-types/contract-type.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('teachers')
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  fullName: string;

  @Column({ length: 150, unique: true })
  institutionalEmail: string;

  @Column({ length: 1 })
  gender: string; // 'M' or 'F'

  @Column({ type: 'varchar', length: 50 })
  academicLevel: string; // Example: 'Master', 'Doctorate'

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  availability: string;

  @ManyToOne(() => ContractType, contractType => contractType.teachers, { eager: true })
  contractType: ContractType;
}
