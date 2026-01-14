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

  async findAll(
    page: number = 1,
    limit: number = 20,
    search?: string,
    role?: 'ADMIN' | 'CLIENT',
    email?: string,
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.OR = [
        { pseudo: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (email) {
      where.email = { contains: email, mode: 'insensitive' };
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          _count: {
            select: { reservations: true },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users.map(({ password: _password, ...user }) => ({
        ...user,
        created_at: user.created_at.toISOString(),
        updated_at: user.updated_at.toISOString(),
      })),
      total,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: { reservations: true },
        },
        auditLogs: {
          orderBy: { created_at: 'desc' },
          take: 10, // Dernières 10 modifications
        },
      },
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

  async update(id: number, updateData: { pseudo?: string; email?: string; role?: 'ADMIN' | 'CLIENT'; is_active?: boolean }, modifiedById: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} introuvable`);
    }

    // Vérifier si l'email existe déjà (sauf pour l'utilisateur actuel)
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: updateData.email },
      });

      if (existingUser && existingUser.id !== id) {
        throw new BadRequestException('Cet email est déjà utilisé par un autre utilisateur');
      }
    }

    // Vérifier si le pseudo existe déjà (sauf pour l'utilisateur actuel)
    if (updateData.pseudo && updateData.pseudo !== user.pseudo) {
      const existingUser = await this.prisma.user.findUnique({
        where: { pseudo: updateData.pseudo },
      });

      if (existingUser && existingUser.id !== id) {
        throw new BadRequestException('Ce pseudo est déjà utilisé par un autre utilisateur');
      }
    }

    // Enregistrer les modifications dans l'audit log
    const auditLogs: Array<{
      modified_by_id: number;
      action: string;
      field_name: string;
      old_value: string;
      new_value: string;
    }> = [];
    
    if (updateData.pseudo && updateData.pseudo !== user.pseudo) {
      auditLogs.push({
        modified_by_id: modifiedById,
        action: 'UPDATE',
        field_name: 'pseudo',
        old_value: JSON.stringify(user.pseudo),
        new_value: JSON.stringify(updateData.pseudo),
      });
    }

    if (updateData.email && updateData.email !== user.email) {
      auditLogs.push({
        modified_by_id: modifiedById,
        action: 'UPDATE',
        field_name: 'email',
        old_value: JSON.stringify(user.email),
        new_value: JSON.stringify(updateData.email),
      });
    }

    if (updateData.role && updateData.role !== user.role) {
      auditLogs.push({
        modified_by_id: modifiedById,
        action: 'UPDATE',
        field_name: 'role',
        old_value: JSON.stringify(user.role),
        new_value: JSON.stringify(updateData.role),
      });
    }

    if (updateData.is_active !== undefined && updateData.is_active !== user.is_active) {
      auditLogs.push({
        modified_by_id: modifiedById,
        action: updateData.is_active ? 'ACTIVATE' : 'DEACTIVATE',
        field_name: 'is_active',
        old_value: JSON.stringify(user.is_active),
        new_value: JSON.stringify(updateData.is_active),
      });
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...updateData,
        auditLogs: auditLogs.length > 0 ? {
          create: auditLogs,
        } : undefined,
      },
      include: {
        _count: {
          select: { reservations: true },
        },
      },
    });

    const { password: _password, ...userWithoutPassword } = updatedUser;

    return {
      ...userWithoutPassword,
      created_at: updatedUser.created_at.toISOString(),
      updated_at: updatedUser.updated_at.toISOString(),
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

  async getUserAuditLogs(userId: number) {
    const logs = await this.prisma.userAuditLog.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      include: {
        modified_by: {
          select: {
            id: true,
            pseudo: true,
            email: true,
          },
        },
      },
    });

    return logs;
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
