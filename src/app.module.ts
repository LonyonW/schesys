import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { MailModule } from './mail/mail.module';
import { AcademicPeriodsModule } from './academic-periods/academic-periods.module';
import { SubjectsModule } from './subjects/subjects.module';
import { GroupsModule } from './groups/groups.module';
import { ClassroomsModule } from './classrooms/classrooms.module';
import { ContractTypesModule } from './contract-types/contract-types.module';
import { TeachersModule } from './teachers/teachers.module';
import { SessionsModule } from './sessions/sessions.module';
import { ValidationsModule } from './common/validations.module';


// guardar credenciales secretas *
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'turntable.proxy.rlwy.net', 
      port: 47470, // docker
      username: 'root',
      password: 'vbRSQisHrsTbVQSyeClONQJmoQjytwhX',
      database: 'academicdb',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    RolesModule,
    MailModule,
    AcademicPeriodsModule,
    SubjectsModule,
    GroupsModule,
    ClassroomsModule,
    ContractTypesModule,
    TeachersModule,
    SessionsModule,
    ValidationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
