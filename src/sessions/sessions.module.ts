import { Module } from '@nestjs/common';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './session.entity';
import { Group } from 'src/groups/group.entity';
import { Classroom } from 'src/classrooms/classroom.entity';
import { ValidationsModule } from 'src/common/validations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Session, Group, Classroom]), // Solo entidades aquí
    ValidationsModule, // El módulo normal aquí
],
  controllers: [SessionsController],
  providers: [SessionsService]
})
export class SessionsModule {}
