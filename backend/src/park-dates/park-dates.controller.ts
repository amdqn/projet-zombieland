import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ParkDatesService } from './park-dates.service';
import type { CreateParkDateDto, UpdateParkDateDto } from '../generated';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('park-dates')
export class ParkDatesController {
  constructor(private readonly parkDatesService: ParkDatesService) {}

  // GET /park-dates (PUBLIC) - Avec filtres optionnels pour calendrier
  @Get()
  findAll(@Query('from') from?: string, @Query('to') to?: string) {
    return this.parkDatesService.findAll(from, to);
  }

  // GET /park-dates/:id (ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.parkDatesService.findOne(id);
  }

  // POST /park-dates (ADMIN) - Création nouvelle date
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() createParkDateDto: CreateParkDateDto) {
    return this.parkDatesService.create(createParkDateDto);
  }

  // PATCH /park-dates/:id (ADMIN) - Modification (ex: fermeture)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateParkDateDto: UpdateParkDateDto,
  ) {
    return this.parkDatesService.update(id, updateParkDateDto);
  }

  // DELETE /park-dates/:id (ADMIN) - Suppression
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.parkDatesService.remove(id);
  }
}
