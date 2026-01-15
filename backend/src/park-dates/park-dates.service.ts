import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import type {
  CreateParkDateDto,
  UpdateParkDateDto,
  ParkDateDto,
} from '../generated';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ParkDatesService {
  constructor(private prisma: PrismaService) {}

  async findAll(from?: string, to?: string): Promise<ParkDateDto[]> {
    const whereClause: any = {};

    if (from || to) {
      whereClause.jour = {};
      if (from) whereClause.jour.gte = new Date(from);
      if (to) whereClause.jour.lte = new Date(to);
    }

    const dates = await this.prisma.parkDate.findMany({
      where: whereClause,
      orderBy: { jour: 'asc' },
    });

    return dates.map((date) => ({
      ...date,
      jour: date.jour.toISOString().split('T')[0],
      open_hour: date.open_hour ? date.open_hour.toISOString().split('T')[1].split('.')[0] : null,
      close_hour: date.close_hour ? date.close_hour.toISOString().split('T')[1].split('.')[0] : null,
      created_at: date.created_at.toISOString(),
    }));
  }

  async findOne(id: number): Promise<ParkDateDto> {
    const parkDate = await this.prisma.parkDate.findUnique({
      where: { id },
    });

    if (!parkDate) {
      throw new NotFoundException(`ParkDate avec l'ID ${id} introuvable`);
    }

    return {
      ...parkDate,
      jour: parkDate.jour.toISOString().split('T')[0],
      open_hour: parkDate.open_hour ? parkDate.open_hour.toISOString().split('T')[1].split('.')[0] : null,
      close_hour: parkDate.close_hour ? parkDate.close_hour.toISOString().split('T')[1].split('.')[0] : null,
      created_at: parkDate.created_at.toISOString(),
    };
  }

  async create(createParkDateDto: CreateParkDateDto): Promise<ParkDateDto> {
    const { jour, is_open, open_hour, close_hour, notes } = createParkDateDto;

    if (!jour) {
      throw new BadRequestException('Le champ "jour" est obligatoire');
    }

    const existingDate = await this.prisma.parkDate.findUnique({
      where: { jour: new Date(jour) },
    });

    if (existingDate) {
      throw new BadRequestException(`Une date existe déjà pour le ${jour}`);
    }

    const newParkDate = await this.prisma.parkDate.create({
      data: {
        jour: new Date(jour),
        is_open: is_open ?? true,
        open_hour: open_hour ? new Date(`1970-01-01T${open_hour}`) : null,
        close_hour: close_hour ? new Date(`1970-01-01T${close_hour}`) : null,
        notes: notes ?? null,
      },
    });

    return {
      ...newParkDate,
      jour: newParkDate.jour.toISOString().split('T')[0],
      open_hour: newParkDate.open_hour ? newParkDate.open_hour.toISOString().split('T')[1].split('.')[0] : null,
      close_hour: newParkDate.close_hour ? newParkDate.close_hour.toISOString().split('T')[1].split('.')[0] : null,
      created_at: newParkDate.created_at.toISOString(),
    };
  }

  async update(
    id: number,
    updateParkDateDto: UpdateParkDateDto,
  ): Promise<ParkDateDto> {
    const parkDate = await this.prisma.parkDate.findUnique({ where: { id } });

    if (!parkDate) {
      throw new NotFoundException(`ParkDate avec l'ID ${id} introuvable`);
    }

    const { jour, is_open, open_hour, close_hour, notes } = updateParkDateDto;

    if (jour && jour !== parkDate.jour.toISOString().split('T')[0]) {
      const existingDate = await this.prisma.parkDate.findUnique({
        where: { jour: new Date(jour) },
      });

      if (existingDate && existingDate.id !== id) {
        throw new BadRequestException(`Une date existe déjà pour le ${jour}`);
      }
    }

    const updatedParkDate = await this.prisma.parkDate.update({
      where: { id },
      data: {
        ...(jour && { jour: new Date(jour) }),
        ...(is_open !== undefined && { is_open }),
        ...(open_hour !== undefined && { open_hour: open_hour ? new Date(`1970-01-01T${open_hour}`) : null }),
        ...(close_hour !== undefined && { close_hour: close_hour ? new Date(`1970-01-01T${close_hour}`) : null }),
        ...(notes !== undefined && { notes }),
      },
    });

    return {
      ...updatedParkDate,
      jour: updatedParkDate.jour.toISOString().split('T')[0],
      open_hour: updatedParkDate.open_hour ? updatedParkDate.open_hour.toISOString().split('T')[1].split('.')[0] : null,
      close_hour: updatedParkDate.close_hour ? updatedParkDate.close_hour.toISOString().split('T')[1].split('.')[0] : null,
      created_at: updatedParkDate.created_at.toISOString(),
    };
  }

  async remove(id: number): Promise<{ message: string }> {
    const parkDate = await this.prisma.parkDate.findUnique({
      where: { id },
      include: {
        _count: {
          select: { reservations: true },
        },
      },
    });

    if (!parkDate) {
      throw new NotFoundException(`ParkDate avec l'ID ${id} introuvable`);
    }

    if (parkDate._count.reservations > 0) {
      throw new BadRequestException(
        `Impossible de supprimer cette date : ${parkDate._count.reservations} réservation(s) associée(s)`,
      );
    }

    await this.prisma.parkDate.delete({ where: { id } });

    return {
      message: `Date du ${parkDate.jour.toISOString().split('T')[0]} supprimée avec succès`,
    };
  }
}
