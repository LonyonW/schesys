import { Module } from '@nestjs/common';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './group.entity';
import { Subject } from 'src/subjects/subject.entity';
import { Teacher } from 'src/teachers/teacher.entity';
import { Session } from 'src/sessions/session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Group, Subject, Teacher, Session])],
  controllers: [GroupsController],
  providers: [GroupsService]
})
export class GroupsModule {}
