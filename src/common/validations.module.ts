import { Module } from '@nestjs/common';
import { ValidationsService } from './validations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from 'src/sessions/session.entity';
import { Group } from 'src/groups/group.entity';
import { Classroom } from 'src/classrooms/classroom.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Session, Group, Classroom])],
    providers: [ValidationsService],
    exports: [ValidationsService],
})
export class ValidationsModule {}
