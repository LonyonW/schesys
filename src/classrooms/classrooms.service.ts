import { Injectable, ConflictException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Classroom } from './classroom.entity';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { FilterClassroomDto } from './dto/filter-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';

@Injectable()
export class ClassroomsService {
  constructor(
    @InjectRepository(Classroom)
    private classroomRepository: Repository<Classroom>,
  ) {}

  async create(data: CreateClassroomDto): Promise<Classroom> {
    const existing = await this.classroomRepository.findOne({
      where: { name: data.name },
    });

    if (existing) {
      throw new ConflictException('A classroom with this name already exists.');
    }

    const classroom = this.classroomRepository.create(data);
    return this.classroomRepository.save(classroom);
  }

  async searchClassrooms(filter: FilterClassroomDto): Promise<Classroom[]> {
    const where: any = {};

    if (filter.name) {
      where.name = ILike(`%${filter.name}%`);
    }

    if (filter.capacity) {
      where.capacity = filter.capacity;
    }

    const classrooms = await this.classroomRepository.find({ where });

    if (classrooms.length === 0) {
      throw new HttpException('No classrooms found with the given criteria.', HttpStatus.NOT_FOUND); //404
    }

    return classrooms;
  }

  async update(id: number, data: UpdateClassroomDto): Promise<Classroom> {
    const classroom = await this.classroomRepository.findOneBy({ id });

    if (!classroom) {
      throw new HttpException('Classroom not found', HttpStatus.NOT_FOUND); //404
    }

    const updatedClassroom = Object.assign(classroom, data);

    return this.classroomRepository.save(updatedClassroom);
  }
}
