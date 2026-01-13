import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Patch,
} from '@nestjs/common';
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
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<Login200Response> {
    const { email, password } = loginDto;

    const user = await this.authService.validateUser(email, password);
    const { access_token } = await this.authService.generateJwt(user);

    return {
      user: {
        ...user,
        created_at: user.created_at.toISOString(),
        updated_at: user.updated_at.toISOString(),
      },
      access_token,
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: UserDto): Promise<UserDto> {
    return user;
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @CurrentUser() user: UserDto,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<UserDto> {
    const updatedUser = await this.authService.updateProfile(
      user.id!,
      updateProfileDto,
    );

    return {
      ...updatedUser,
      created_at: updatedUser.created_at.toISOString(),
      updated_at: updatedUser.updated_at.toISOString(),
    };
  }
}
