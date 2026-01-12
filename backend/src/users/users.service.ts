import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import type { UserDto } from '../generated';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<UserDto[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { created_at: 'desc' },
    });

    return users.map(({ password: _password, ...user }) => ({
      ...user,
      created_at: user.created_at.toISOString(),
      updated_at: user.updated_at.toISOString(),
    }));
  }

  async findOne(id: number): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} introuvable`);
    }

    const { password: _password, ...userWithoutPassword } = user;

    return {
      ...userWithoutPassword,
      created_at: user.created_at.toISOString(),
      updated_at: user.updated_at.toISOString(),
    };
  }

  async findUserReservations(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(
        `Utilisateur avec l'ID ${userId} introuvable`,
      );
    }

    const reservations = await this.prisma.reservation.findMany({
      where: { user_id: userId },
      include: {
        date: true,
      },
      orderBy: { created_at: 'desc' },
    });

    return reservations;
  }

  async remove(id: number): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: { reservations: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} introuvable`);
    }

    if (user._count.reservations > 0) {
      throw new BadRequestException(
        `Impossible de supprimer cet utilisateur : ${user._count.reservations} réservation(s) associée(s)`,
      );
    }

    await this.prisma.user.delete({ where: { id } });

    return {
      message: `Utilisateur ${user.pseudo} supprimé avec succès`,
    };
  }
}
