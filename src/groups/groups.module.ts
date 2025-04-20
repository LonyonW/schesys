import { Module } from '@nestjs/common';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './group.entity';
import { Subject } from 'src/subjects/subject.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Group, Subject])],
  controllers: [GroupsController],
  providers: [GroupsService]
})
export class GroupsModule {}
