import {
  Controller,
  Get,
  Param,
  Delete,
  Patch,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { UserDto } from '../generated';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('role') role?: 'ADMIN' | 'CLIENT',
    @Query('email') email?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 20;
    return this.usersService.findAll(pageNum, limitNum, search, role, email);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Get(':id/reservations')
  findUserReservations(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findUserReservations(id);
  }

  @Get(':id/audit-logs')
  getUserAuditLogs(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserAuditLogs(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    updateData: {
      pseudo?: string;
      email?: string;
      role?: 'ADMIN' | 'CLIENT';
      is_active?: boolean;
    },
    @CurrentUser() admin: UserDto,
  ) {
    return this.usersService.update(id, updateData, admin.id!);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
