import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Teacher } from './teacher.entity';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { ContractType } from 'src/contract-types/contract-type.entity';
import { FilterTeacherDto } from './dto/filter-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepo: Repository<Teacher>,
    @InjectRepository(ContractType)
    private readonly contractTypeRepo: Repository<ContractType>,
  ) { }

  async create(data: CreateTeacherDto): Promise<Teacher> {
    const existingTeacher = await this.teacherRepo.findOne({
      where: { institutional_email: data.institutional_email },
    });

    if (existingTeacher) {
      throw new ConflictException('Institutional email is already registered');
    }

    const contractType = await this.contractTypeRepo.findOne({
      where: { id: data.contract_type_id },
    });

    if (!contractType) {
      throw new NotFoundException('Contract type not found');
    }

    const newTeacher = this.teacherRepo.create(data);

    return this.teacherRepo.save(newTeacher);
  }

  async searchTeachers(filter: FilterTeacherDto): Promise<Teacher[]> {
    const where: any = {};

    if (filter.name) {
      where.fullName = ILike(`%${filter.name}%`);
    }

    if (filter.is_active !== undefined) {
      where.is_active = filter.is_active;
    }

    return this.teacherRepo.find({ where });
  }

  async updateTeacher(id: number, data: UpdateTeacherDto): Promise<Teacher> {
    const teacher = await this.teacherRepo.findOne({ where: { id } });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    if (data.contract_type_id) {
      const contractType = await this.contractTypeRepo.findOne({ where: { id: data.contract_type_id } });
      if (!contractType) {
        throw new NotFoundException('Contract type not found');
      }
      teacher.contract_type = contractType;
    }

    //const updatedTeacher = Object.assign(teacher, data);
    //return this.teacherRepo.save(updatedTeacher);
    teacher.full_name = data.name ?? teacher.full_name;
    teacher.institutional_email = data.institutional_email ?? teacher.institutional_email;
    teacher.academic_level = data.academic_level ?? teacher.academic_level;
    teacher.is_active = data.is_active ?? teacher.is_active;

    return this.teacherRepo.save(teacher);
  }
}
