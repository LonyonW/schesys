import { Module } from '@nestjs/common';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './session.entity';
import { Group } from 'src/groups/group.entity';
import { Classroom } from 'src/classrooms/classroom.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Session, Group, Classroom])],
  controllers: [SessionsController],
  providers: [SessionsService]
})
export class SessionsModule {}
