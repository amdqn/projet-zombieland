import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import type {
  CreateReservationDto,
  UpdateReservationStatusDto,
} from 'src/generated';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('reservations')
@UseGuards(JwtAuthGuard) // Toutes les routes nécessitent authentification
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  // 1. Créer une réservation (CLIENT authentifié)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createReservationDto: CreateReservationDto,
    @CurrentUser() user: any,
  ) {
    return this.reservationsService.create(createReservationDto, user.id, user.role);
  }

  // 2. Voir MES réservations (CLIENT)
@Get('my')
@HttpCode(HttpStatus.OK)
async findMy(@CurrentUser() user: any) {
  return this.reservationsService.findByUserId(user.id, user.role);  // ← Ajouter user.role
}

  // 3. Voir TOUTES les réservations (ADMIN uniquement)
  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async findAll(
    @CurrentUser() user: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('userId') userId?: string,
    @Query('status') status?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('ticketType') ticketType?: string,
    @Query('sortBy') sortBy?: string,
  ) {
    return this.reservationsService.findAll(user.role, {
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      search,
      userId: userId ? parseInt(userId, 10) : undefined,
      status,
      dateFrom,
      dateTo,
      ticketType,
      sortBy,
    });
  }

  // 4. Voir UNE réservation (CLIENT si propriétaire, ADMIN toujours)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return this.reservationsService.findOne(id, user.id, user.role);
  }

  // 5. Changer le statut d'une réservation (ADMIN uniquement)
  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateReservationStatusDto,
  ) {
    return this.reservationsService.updateStatus(id, updateStatusDto);
  }

  // 6. Annuler/Supprimer une réservation (CLIENT si J-10, ADMIN toujours)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return this.reservationsService.remove(id, user.id, user.role);
  }
}