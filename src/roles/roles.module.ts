import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol } from './rol.entity';
import { User } from 'src/users/user.entity';
import { JwtStrategy } from 'src/auth/jwt/jwt.estrategy';

@Module({
  imports: [TypeOrmModule.forFeature([Rol, User])],
  providers: [RolesService, JwtStrategy], // strategy para poder usar la proteccion de rutas
  controllers: [RolesController]
})
export class RolesModule {}
