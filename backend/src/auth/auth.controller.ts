import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Patch,
  Delete,
} from '@nestjs/common';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import type {
  RegisterDto,
  LoginDto,
  Login200Response,
  UserDto,
  UpdateProfileDto,
} from 'src/generated';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 3, ttl: 3600000 } })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async login(@Body() loginDto: LoginDto): Promise<Login200Response> {
    const { email, password } = loginDto;

    const user = await this.authService.validateUser(email, password);
    const { access_token } = await this.authService.generateJwt(user);

    return {
      user,
      access_token,
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @SkipThrottle()
  async getProfile(@CurrentUser() user: UserDto): Promise<UserDto> {
    return user;
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @CurrentUser() user: UserDto,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<UserDto> {
    return this.authService.updateProfile(user.id!, updateProfileDto);
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteAccount(@CurrentUser() user: UserDto) {
    return this.authService.deleteAccount(user.id!);
  }
}
