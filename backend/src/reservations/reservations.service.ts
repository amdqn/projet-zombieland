import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type {
  CreateReservationDto,
  UpdateReservationStatusDto,
} from 'src/generated';

@Injectable()
export class ReservationsService {
  constructor(private readonly prisma: PrismaService) {}

  // === CONSTANTS ===
  private readonly RESERVATION_INCLUDE = {
    user: {
      select: {
        id: true,
        email: true,
        pseudo: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    },
    date: true,
  };

  // === HELPERS ===
  /**
   * Formate une réservation avec conversion des dates et champs calculés
   */
  private formatReservationResponse(reservation: any, userRole: string) {
    const formatted: any = {
      ...reservation,
      created_at: reservation.created_at.toISOString(),
      updated_at: reservation.updated_at.toISOString(),
      date: {
        ...reservation.date,
        jour: reservation.date.jour.toISOString(),
        created_at: reservation.date.created_at.toISOString(),
      },
    };

    if (reservation.user) {
      formatted.user = {
        ...reservation.user,
        created_at: reservation.user.created_at.toISOString(),
        updated_at: reservation.user.updated_at.toISOString(),
      };
    }

    return {
      ...formatted,
      ...this.calculateCancellationInfo(reservation, userRole),
    };
  }

  // === 1. CREATE - Créer une réservation ===
  async create(dto: CreateReservationDto, userId: number, userRole: string) {
    const { date_id, tickets } = dto;

    if (!date_id || !tickets || tickets.length === 0) {
      throw new BadRequestException(
        'La date et au moins un type de ticket sont requis',
      );
    }

    // Vérifier que toutes les quantités sont positives
    for (const ticket of tickets) {
      if (!ticket.price_id || !ticket.quantity || ticket.quantity <= 0) {
        throw new BadRequestException(
          'Chaque ticket doit avoir un price_id et une quantité positive',
        );
      }
    }

    const parkDate = await this.prisma.parkDate.findUnique({
      where: { id: date_id },
    });

    if (!parkDate) {
      throw new NotFoundException(
        `Date de parc avec l'ID ${date_id} non trouvée`,
      );
    }

    if (!parkDate.is_open) {
      throw new BadRequestException('Le parc est fermé ce jour-là');
    }

    // Vérifier que la date n'est pas dans le passé
    const visitDate = new Date(parkDate.jour);
    visitDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (visitDate < today) {
      throw new BadRequestException(
        'Impossible de réserver pour une date passée',
      );
    }

    // Récupérer tous les tarifs et calculer le total
    const ticketsData: any[] = [];
    let totalAmount = 0;

    for (const ticket of tickets) {
      const price = await this.prisma.price.findUnique({
        where: { id: ticket.price_id },
      });

      if (!price) {
        throw new NotFoundException(
          `Tarif avec l'ID ${ticket.price_id} non trouvé`,
        );
      }

      const subtotal = Number(price.amount) * ticket.quantity;
      totalAmount += subtotal;

      ticketsData.push({
        price_id: ticket.price_id,
        label: price.label,
        type: price.type,
        quantity: ticket.quantity,
        unit_price: Number(price.amount),
        subtotal: subtotal,
      });
    }

    const reservationNumber = `ZL-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const reservation = await this.prisma.reservation.create({
      data: {
        reservation_number: reservationNumber,
        user_id: userId,
        date_id,
        tickets: ticketsData as any,
        total_amount: totalAmount,
        status: 'PENDING',
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            pseudo: true,
            role: true,
            created_at: true,
            updated_at: true,
          },
        },
        date: true,
      },
    });

    return this.formatReservationResponse(reservation, userRole);
  }

  // === 2. FIND BY USER ID - Mes réservations ===
  async findByUserId(userId: number, userRole: string) {
    const reservations = await this.prisma.reservation.findMany({
      where: { user_id: userId },
      include: { date: true },
      orderBy: { created_at: 'desc' },
    });

    return reservations.map((reservation) =>
      this.formatReservationResponse(reservation, userRole),
    );
  }

  // === 3. FIND ALL - Toutes les réservations (ADMIN) ===
  async findAll(
    userRole: string = 'ADMIN',
    options?: {
      page?: number;
      limit?: number;
      search?: string;
      userId?: number;
      status?: string;
      dateFrom?: string;
      dateTo?: string;
      ticketType?: string;
      sortBy?: string;
    }
  ) {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    // Construction des filtres
    const where: any = {};

    // Recherche globale
    if (options?.search) {
      const search = options.search.toLowerCase();
      const searchConditions: any[] = [
        {
          reservation_number: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          user: {
            email: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          user: {
            pseudo: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      ];

      // Recherche par statut 
      const searchUpper = search.toUpperCase();
      if (searchUpper === 'PENDING' || searchUpper === 'EN ATTENTE' || searchUpper.includes('PEND') || searchUpper.includes('ATTENT')) {
        searchConditions.push({ status: 'PENDING' });
      }
      if (searchUpper === 'CONFIRMED' || searchUpper === 'CONFIRMÉE' || searchUpper === 'CONFIRME' || searchUpper.includes('CONF')) {
        searchConditions.push({ status: 'CONFIRMED' });
      }
      if (searchUpper === 'CANCELLED' || searchUpper === 'ANNULÉE' || searchUpper === 'ANNULE' || searchUpper.includes('ANN')) {
        searchConditions.push({ status: 'CANCELLED' });
      }

      where.OR = searchConditions;
    }

    // Filtre par utilisateur
    if (options?.userId) {
      where.user_id = options.userId;
    }

    // Filtre par statut
    if (options?.status) {
      where.status = options.status;
    }

    // Filtre par date (plage)
    if (options?.dateFrom || options?.dateTo) {
      where.date = {
        jour: {},
      };
      if (options?.dateFrom) {
        where.date.jour.gte = new Date(options.dateFrom);
      }
      if (options?.dateTo) {
        where.date.jour.lte = new Date(options.dateTo);
      }
    }

    // Gestion du tri
    let orderBy: any = { created_at: 'desc' }; // Par défaut : plus récentes en premier

    if (options?.sortBy) {
      const [field, order] = options.sortBy.split('_');
      const sortOrder = order === 'asc' ? 'asc' : 'desc';

      switch (field) {
        case 'created':
          orderBy = { created_at: sortOrder };
          break;
        case 'date':
          orderBy = { date: { jour: sortOrder } };
          break;
        case 'amount':
          orderBy = { total_amount: sortOrder };
          break;
        case 'status':
          orderBy = { status: sortOrder };
          break;
        case 'number':
          orderBy = { reservation_number: sortOrder };
          break;
        default:
          orderBy = { created_at: 'desc' };
      }
    }

    // Requête avec pagination
    const [reservations, total] = await Promise.all([
      this.prisma.reservation.findMany({
        where,
        include: this.RESERVATION_INCLUDE,
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.reservation.count({ where }),
    ]);

    return {
      data: reservations.map((reservation) =>
        this.formatReservationResponse(reservation, userRole),
      ),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)), 
      },
    };
  }

  // === 4. FIND ONE - Détail d'une réservation ===
  async findOne(id: number, userId: number, userRole: string) {
    if (!id || id <= 0) {
      throw new BadRequestException('ID de réservation invalide');
    }

    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: this.RESERVATION_INCLUDE,
    });

    if (!reservation) {
      throw new NotFoundException(`Réservation avec l'ID ${id} non trouvée`);
    }

    if (userRole !== 'ADMIN' && reservation.user_id !== userId) {
      throw new ForbiddenException("Vous n'avez pas accès à cette réservation");
    }

    return this.formatReservationResponse(reservation, userRole);
  }

  // === 5. UPDATE STATUS - Changer le statut (ADMIN) ===
  async updateStatus(id: number, dto: UpdateReservationStatusDto) {
    if (!id || id <= 0) {
      throw new BadRequestException('ID de réservation invalide');
    }

    const exists = await this.prisma.reservation.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new NotFoundException(`Réservation avec l'ID ${id} non trouvée`);
    }

    const { status } = dto;

    const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException('Statut invalide');
    }

    const updated = await this.prisma.reservation.update({
      where: { id },
      data: { status },
      include: this.RESERVATION_INCLUDE,
    });

    return this.formatReservationResponse(updated, 'ADMIN');
  }

  // === 6. REMOVE - Annuler/Supprimer réservation (RÈGLE J-10) ===
  async remove(id: number, userId: number, userRole: string) {
    if (!id || id <= 0) {
      throw new BadRequestException('ID de réservation invalide');
    }

    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: {
        date: true,
      },
    });

    if (!reservation) {
      throw new NotFoundException(`Réservation avec l'ID ${id} non trouvée`);
    }

    // === LOGIQUE ADMIN ===
    if (userRole === 'ADMIN') {
      // L'administrateur peut tout supprimer sans restriction
      await this.prisma.reservation.delete({ where: { id } });
      return {
        message: `Réservation ${id} supprimée avec succès par l'administrateur`,
      };
    }

    // === LOGIQUE CLIENT ===
    if (reservation.user_id !== userId) {
      throw new ForbiddenException(
        'Vous ne pouvez pas annuler cette réservation',
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const visitDate = new Date(reservation.date.jour);
    visitDate.setHours(0, 0, 0, 0);

    const diffTime = visitDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Règle J-10: annulation impossible si < 10 jours
    if (diffDays < 10) {
      throw new ForbiddenException(
        `Annulation impossible : la visite est dans ${diffDays} jour(s). Annulation possible uniquement si la visite est dans plus de 10 jours.`,
      );
    }

    await this.prisma.reservation.delete({ where: { id } });

    return {
      message: `Réservation ${id} annulée avec succès`,
    };
  }

  private calculateCancellationInfo(reservation: any, userRole: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const visitDate = new Date(reservation.date.jour);
    visitDate.setHours(0, 0, 0, 0);

    const diffTime = visitDate.getTime() - today.getTime();
    const daysUntilVisit = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const canCancel = userRole === 'ADMIN' || daysUntilVisit >= 10;

    const cancellationDeadline = new Date(visitDate);
    cancellationDeadline.setDate(visitDate.getDate() - 10);

    return {
      can_cancel: canCancel,
      days_until_visit: daysUntilVisit,
      cancellation_deadline: cancellationDeadline.toISOString(),
    };
  }
}
