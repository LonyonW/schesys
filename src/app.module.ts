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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost', // for local development
      //host: '172.17.0.3', // for docker
      port: 3307, // local
      //port: 3306, // docker
      username: 'root',
      password: 'lonyon123',
      database: 'academicdb',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    // ConfigModule.forRoot({
    //
    UsersModule,
    AuthModule,
    RolesModule,
    MailModule,
    AcademicPeriodsModule,
    SubjectsModule,
    GroupsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
