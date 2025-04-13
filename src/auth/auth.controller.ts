import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { hasRoles } from './jwt/has-roles';
import { JwtRole } from './jwt/jwt-role';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { JwtRolesGuard } from './jwt/jwt-roles.guard';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}


    @hasRoles(JwtRole.ADMIN) // PTOTECCION DE RUTAS por rol
    @UseGuards(JwtAuthGuard, JwtRolesGuard) // PTOTECCION DE RUTAS token obligado
    @Post('register') // http://localhost:3000/auth/register -> POST
    register(@Body() user: RegisterAuthDto) {
        return this.authService.register(user);
    }

    @Post('login') // http://localhost:3000/auth/login -> POST
    login(@Body() loginData: LoginAuthDto) {
        return this.authService.login(loginData);
    }
}
