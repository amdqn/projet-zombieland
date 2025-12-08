import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { RegisterDto, LoginDto, Login200Response } from 'src/generated';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<Login200Response> {
    const { email, password } = loginDto;
    
    // Valider les credentials
    const user = await this.authService.validateUser(email, password);
    
    // Générer le JWT
    const { access_token, expires_in } = await this.authService.generateJwt(user);
    
    return {
      user: {
        ...user,
        created_at: user.created_at.toISOString(),
        updated_at: user.updated_at.toISOString(),
      },
      access_token,
      expires_in,
    };
  }
}
