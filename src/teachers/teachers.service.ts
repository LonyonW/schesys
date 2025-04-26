import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './teacher.entity';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { ContractType } from 'src/contract-types/contract-type.entity';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepo: Repository<Teacher>,
    @InjectRepository(ContractType)
    private readonly contractTypeRepo: Repository<ContractType>,
  ) {}

  async create(data: CreateTeacherDto): Promise<Teacher> {
    const existingTeacher = await this.teacherRepo.findOne({
      where: { institutionalEmail: data.institutionalEmail },
    });

    if (existingTeacher) {
      throw new ConflictException('Institutional email is already registered');
    }

    const contractType = await this.contractTypeRepo.findOne({
      where: { id: data.contractTypeId },
    });

    if (!contractType) {
      throw new NotFoundException('Contract type not found');
    }

    const newTeacher = this.teacherRepo.create({
      fullName: data.fullName,
      institutionalEmail: data.institutionalEmail,
      gender: data.gender,
      academicLevel: data.academicLevel,
      isActive: data.isActive,
      availability: data.availability,
      contractType: contractType,
    });

    return this.teacherRepo.save(newTeacher);
  }

  async findAll(): Promise<Teacher[]> {
    return this.teacherRepo.find();
  }
}
