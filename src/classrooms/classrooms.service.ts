import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Classroom } from './classroom.entity';
import { CreateClassroomDto } from './dto/create-classroom.dto';

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
}
