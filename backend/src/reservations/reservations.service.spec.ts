import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from './reservations.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import type {
  CreateReservationDto,
  UpdateReservationStatusDto,
} from 'src/generated';

describe('ReservationsService', () => {
  let service: ReservationsService;
  let _prismaService: PrismaService;

  const mockPrismaService = {
    parkDate: {
      findUnique: jest.fn(),
    },
    price: {
      findUnique: jest.fn(),
    },
    reservation: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('devrait être défini', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const validDto: CreateReservationDto = {
      date_id: 1,
      tickets: [
        { price_id: 1, quantity: 2 },
        { price_id: 2, quantity: 1 },
      ],
    };

    const mockParkDate = {
      id: 1,
      jour: new Date('2025-12-25'),
      is_open: true,
      notes: null,
      created_at: new Date('2025-01-01'),
    };

    const mockPrice1 = {
      id: 1,
      label: 'Adulte',
      type: 'ADULT',
      amount: 25.0,
      created_at: new Date('2025-01-01'),
    };

    const mockPrice2 = {
      id: 2,
      label: 'Enfant',
      type: 'CHILD',
      amount: 15.0,
      created_at: new Date('2025-01-01'),
    };

    const mockReservation = {
      id: 1,
      reservation_number: 'ZL-1234567890-ABC12',
      user_id: 1,
      date_id: 1,
      tickets: [
        {
          price_id: 1,
          label: 'Adulte',
          type: 'ADULT',
          quantity: 2,
          unit_price: 25.0,
          subtotal: 50.0,
        },
        {
          price_id: 2,
          label: 'Enfant',
          type: 'CHILD',
          quantity: 1,
          unit_price: 15.0,
          subtotal: 15.0,
        },
      ],
      total_amount: 65.0,
      status: 'PENDING',
      created_at: new Date('2025-01-10'),
      updated_at: new Date('2025-01-10'),
      user: {
        id: 1,
        email: 'user@test.com',
        pseudo: 'TestUser',
        role: 'CLIENT',
        created_at: new Date('2025-01-01'),
        updated_at: new Date('2025-01-01'),
      },
      date: mockParkDate,
    };

    it('devrait créer une réservation avec succès', async () => {
      mockPrismaService.parkDate.findUnique.mockResolvedValue(mockParkDate);
      mockPrismaService.price.findUnique
        .mockResolvedValueOnce(mockPrice1)
        .mockResolvedValueOnce(mockPrice2);
      mockPrismaService.reservation.create.mockResolvedValue(mockReservation);

      const result = await service.create(validDto, 1, 'CLIENT');

      expect(result).toBeDefined();
      expect(result.total_amount).toBe(65.0);
      expect(result.status).toBe('PENDING');
      expect(mockPrismaService.parkDate.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockPrismaService.price.findUnique).toHaveBeenCalledTimes(2);
      expect(mockPrismaService.reservation.create).toHaveBeenCalled();
    });

    it('devrait lancer BadRequestException si date_id manquant', async () => {
      const invalidDto = { ...validDto, date_id: undefined as any };

      await expect(service.create(invalidDto, 1, 'CLIENT')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(invalidDto, 1, 'CLIENT')).rejects.toThrow(
        'La date et au moins un type de ticket sont requis',
      );
    });

    it('devrait lancer BadRequestException si tickets est vide', async () => {
      const invalidDto = { ...validDto, tickets: [] };

      await expect(service.create(invalidDto, 1, 'CLIENT')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(invalidDto, 1, 'CLIENT')).rejects.toThrow(
        'La date et au moins un type de ticket sont requis',
      );
    });

    it('devrait lancer BadRequestException si quantité <= 0', async () => {
      const invalidDto = {
        ...validDto,
        tickets: [{ price_id: 1, quantity: 0 }],
      };

      await expect(service.create(invalidDto, 1, 'CLIENT')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(invalidDto, 1, 'CLIENT')).rejects.toThrow(
        'Chaque ticket doit avoir un price_id et une quantité positive',
      );
    });

    it('devrait lancer NotFoundException si date de parc non trouvée', async () => {
      mockPrismaService.parkDate.findUnique.mockResolvedValue(null);

      await expect(service.create(validDto, 1, 'CLIENT')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.create(validDto, 1, 'CLIENT')).rejects.toThrow(
        "Date de parc avec l'ID 1 non trouvée",
      );
    });

    it('devrait lancer BadRequestException si parc fermé', async () => {
      mockPrismaService.parkDate.findUnique.mockResolvedValue({
        ...mockParkDate,
        is_open: false,
      });

      await expect(service.create(validDto, 1, 'CLIENT')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(validDto, 1, 'CLIENT')).rejects.toThrow(
        'Le parc est fermé ce jour-là',
      );
    });

    it('devrait lancer BadRequestException si date dans le passé', async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 5);

      mockPrismaService.parkDate.findUnique.mockResolvedValue({
        ...mockParkDate,
        jour: pastDate,
      });

      await expect(service.create(validDto, 1, 'CLIENT')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(validDto, 1, 'CLIENT')).rejects.toThrow(
        'Impossible de réserver pour une date passée',
      );
    });

    it('devrait lancer NotFoundException si price_id non trouvé', async () => {
      mockPrismaService.parkDate.findUnique.mockResolvedValue(mockParkDate);
      mockPrismaService.price.findUnique.mockResolvedValue(null);

      await expect(service.create(validDto, 1, 'CLIENT')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.create(validDto, 1, 'CLIENT')).rejects.toThrow(
        "Tarif avec l'ID 1 non trouvé",
      );
    });
  });

  describe('findByUserId', () => {
    const mockReservations = [
      {
        id: 1,
        reservation_number: 'ZL-001',
        user_id: 1,
        date_id: 1,
        tickets: [],
        total_amount: 50.0,
        status: 'CONFIRMED',
        created_at: new Date('2025-01-10'),
        updated_at: new Date('2025-01-10'),
        date: {
          id: 1,
          jour: new Date('2025-12-25'),
          is_open: true,
          notes: null,
          created_at: new Date('2025-01-01'),
        },
      },
      {
        id: 2,
        reservation_number: 'ZL-002',
        user_id: 1,
        date_id: 2,
        tickets: [],
        total_amount: 30.0,
        status: 'PENDING',
        created_at: new Date('2025-01-09'),
        updated_at: new Date('2025-01-09'),
        date: {
          id: 2,
          jour: new Date('2025-12-26'),
          is_open: true,
          notes: null,
          created_at: new Date('2025-01-01'),
        },
      },
    ];

    it("devrait retourner toutes les réservations d'un utilisateur", async () => {
      mockPrismaService.reservation.findMany.mockResolvedValue(
        mockReservations,
      );

      const result = await service.findByUserId(1, 'CLIENT');

      expect(result).toHaveLength(2);
      expect(result[0].user_id).toBe(1);
      expect(result[1].user_id).toBe(1);
      expect(mockPrismaService.reservation.findMany).toHaveBeenCalledWith({
        where: { user_id: 1 },
        include: { date: true },
        orderBy: { created_at: 'desc' },
      });
    });

    it('devrait retourner un tableau vide si aucune réservation', async () => {
      mockPrismaService.reservation.findMany.mockResolvedValue([]);

      const result = await service.findByUserId(999, 'CLIENT');

      expect(result).toEqual([]);
    });
  });

  describe('findAll', () => {
    const mockReservations = [
      {
        id: 1,
        reservation_number: 'ZL-001',
        user_id: 1,
        date_id: 1,
        tickets: [],
        total_amount: 50.0,
        status: 'CONFIRMED',
        created_at: new Date('2025-01-10'),
        updated_at: new Date('2025-01-10'),
        user: {
          id: 1,
          email: 'user1@test.com',
          pseudo: 'User1',
          role: 'CLIENT',
          created_at: new Date('2025-01-01'),
          updated_at: new Date('2025-01-01'),
        },
        date: {
          id: 1,
          jour: new Date('2025-12-25'),
          is_open: true,
          notes: null,
          created_at: new Date('2025-01-01'),
        },
      },
    ];

    it('devrait retourner toutes les réservations (ADMIN)', async () => {
      mockPrismaService.reservation.findMany.mockResolvedValue(
        mockReservations,
      );

      const result = await service.findAll('ADMIN');

      expect(result).toHaveLength(1);
      expect(result[0]).toBeDefined();
      expect(mockPrismaService.reservation.findMany).toHaveBeenCalledWith({
        include: expect.objectContaining({
          user: expect.any(Object),
          date: true,
        }),
        orderBy: { created_at: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    const mockReservation = {
      id: 1,
      reservation_number: 'ZL-001',
      user_id: 1,
      date_id: 1,
      tickets: [],
      total_amount: 50.0,
      status: 'CONFIRMED',
      created_at: new Date('2025-01-10'),
      updated_at: new Date('2025-01-10'),
      user: {
        id: 1,
        email: 'user@test.com',
        pseudo: 'TestUser',
        role: 'CLIENT',
        created_at: new Date('2025-01-01'),
        updated_at: new Date('2025-01-01'),
      },
      date: {
        id: 1,
        jour: new Date('2025-12-25'),
        is_open: true,
        notes: null,
        created_at: new Date('2025-01-01'),
      },
    };

    it('devrait retourner une réservation par ID (propriétaire)', async () => {
      mockPrismaService.reservation.findUnique.mockResolvedValue(
        mockReservation,
      );

      const result = await service.findOne(1, 1, 'CLIENT');

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(mockPrismaService.reservation.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: expect.any(Object),
      });
    });

    it('devrait retourner une réservation par ID (ADMIN)', async () => {
      mockPrismaService.reservation.findUnique.mockResolvedValue(
        mockReservation,
      );

      const result = await service.findOne(1, 999, 'ADMIN');

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
    });

    it('devrait lancer BadRequestException si ID invalide', async () => {
      await expect(service.findOne(0, 1, 'CLIENT')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.findOne(-1, 1, 'CLIENT')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.findOne(0, 1, 'CLIENT')).rejects.toThrow(
        'ID de réservation invalide',
      );
    });

    it('devrait lancer NotFoundException si réservation non trouvée', async () => {
      mockPrismaService.reservation.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999, 1, 'CLIENT')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne(999, 1, 'CLIENT')).rejects.toThrow(
        "Réservation avec l'ID 999 non trouvée",
      );
    });

    it('devrait lancer ForbiddenException si utilisateur non propriétaire', async () => {
      mockPrismaService.reservation.findUnique.mockResolvedValue(
        mockReservation,
      );

      await expect(service.findOne(1, 999, 'CLIENT')).rejects.toThrow(
        ForbiddenException,
      );
      await expect(service.findOne(1, 999, 'CLIENT')).rejects.toThrow(
        "Vous n'avez pas accès à cette réservation",
      );
    });
  });

  describe('updateStatus', () => {
    const mockReservation = {
      id: 1,
      reservation_number: 'ZL-001',
      user_id: 1,
      date_id: 1,
      tickets: [],
      total_amount: 50.0,
      status: 'PENDING',
      created_at: new Date('2025-01-10'),
      updated_at: new Date('2025-01-10'),
      user: {
        id: 1,
        email: 'user@test.com',
        pseudo: 'TestUser',
        role: 'CLIENT',
        created_at: new Date('2025-01-01'),
        updated_at: new Date('2025-01-01'),
      },
      date: {
        id: 1,
        jour: new Date('2025-12-25'),
        is_open: true,
        notes: null,
        created_at: new Date('2025-01-01'),
      },
    };

    it('devrait mettre à jour le statut en CONFIRMED', async () => {
      const dto: UpdateReservationStatusDto = { status: 'CONFIRMED' };
      mockPrismaService.reservation.findUnique.mockResolvedValue(
        mockReservation,
      );
      mockPrismaService.reservation.update.mockResolvedValue({
        ...mockReservation,
        status: 'CONFIRMED',
      });

      const result = await service.updateStatus(1, dto);

      expect(result.status).toBe('CONFIRMED');
      expect(mockPrismaService.reservation.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { status: 'CONFIRMED' },
        include: expect.any(Object),
      });
    });

    it('devrait mettre à jour le statut en CANCELLED', async () => {
      const dto: UpdateReservationStatusDto = { status: 'CANCELLED' };
      mockPrismaService.reservation.findUnique.mockResolvedValue(
        mockReservation,
      );
      mockPrismaService.reservation.update.mockResolvedValue({
        ...mockReservation,
        status: 'CANCELLED',
      });

      const result = await service.updateStatus(1, dto);

      expect(result.status).toBe('CANCELLED');
    });

    it('devrait lancer BadRequestException si ID invalide', async () => {
      const dto: UpdateReservationStatusDto = { status: 'CONFIRMED' };

      await expect(service.updateStatus(0, dto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.updateStatus(0, dto)).rejects.toThrow(
        'ID de réservation invalide',
      );
    });

    it('devrait lancer NotFoundException si réservation non trouvée', async () => {
      const dto: UpdateReservationStatusDto = { status: 'CONFIRMED' };
      mockPrismaService.reservation.findUnique.mockResolvedValue(null);

      await expect(service.updateStatus(999, dto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.updateStatus(999, dto)).rejects.toThrow(
        "Réservation avec l'ID 999 non trouvée",
      );
    });

    it('devrait lancer BadRequestException si statut invalide', async () => {
      const dto = { status: 'INVALID_STATUS' } as any;
      mockPrismaService.reservation.findUnique.mockResolvedValue(
        mockReservation,
      );

      await expect(service.updateStatus(1, dto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.updateStatus(1, dto)).rejects.toThrow(
        'Statut invalide',
      );
    });
  });

  describe('remove', () => {
    it('devrait supprimer une réservation (ADMIN sans restriction)', async () => {
      const mockReservation = {
        id: 1,
        reservation_number: 'ZL-001',
        user_id: 1,
        date_id: 1,
        tickets: [],
        total_amount: 50.0,
        status: 'PENDING',
        created_at: new Date('2025-01-10'),
        updated_at: new Date('2025-01-10'),
        date: {
          id: 1,
          jour: new Date('2025-01-15'), // Dans 4 jours
          is_open: true,
          notes: null,
          created_at: new Date('2025-01-01'),
        },
      };

      mockPrismaService.reservation.findUnique.mockResolvedValue(
        mockReservation,
      );
      mockPrismaService.reservation.delete.mockResolvedValue(mockReservation);

      const result = await service.remove(1, 999, 'ADMIN');

      expect(result.message).toContain(
        "supprimée avec succès par l'administrateur",
      );
      expect(mockPrismaService.reservation.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('devrait annuler une réservation CLIENT si > 10 jours', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 15); // Dans 15 jours

      const mockReservation = {
        id: 1,
        reservation_number: 'ZL-001',
        user_id: 1,
        date_id: 1,
        tickets: [],
        total_amount: 50.0,
        status: 'PENDING',
        created_at: new Date('2025-01-10'),
        updated_at: new Date('2025-01-10'),
        date: {
          id: 1,
          jour: futureDate,
          is_open: true,
          notes: null,
          created_at: new Date('2025-01-01'),
        },
      };

      mockPrismaService.reservation.findUnique.mockResolvedValue(
        mockReservation,
      );
      mockPrismaService.reservation.delete.mockResolvedValue(mockReservation);

      const result = await service.remove(1, 1, 'CLIENT');

      expect(result.message).toContain('annulée avec succès');
      expect(mockPrismaService.reservation.delete).toHaveBeenCalled();
    });

    it('devrait lancer ForbiddenException si CLIENT et < 10 jours', async () => {
      const nearDate = new Date();
      nearDate.setDate(nearDate.getDate() + 5); // Dans 5 jours

      const mockReservation = {
        id: 1,
        reservation_number: 'ZL-001',
        user_id: 1,
        date_id: 1,
        tickets: [],
        total_amount: 50.0,
        status: 'PENDING',
        created_at: new Date('2025-01-10'),
        updated_at: new Date('2025-01-10'),
        date: {
          id: 1,
          jour: nearDate,
          is_open: true,
          notes: null,
          created_at: new Date('2025-01-01'),
        },
      };

      mockPrismaService.reservation.findUnique.mockResolvedValue(
        mockReservation,
      );

      await expect(service.remove(1, 1, 'CLIENT')).rejects.toThrow(
        ForbiddenException,
      );
      await expect(service.remove(1, 1, 'CLIENT')).rejects.toThrow(
        /Annulation impossible/,
      );
      expect(mockPrismaService.reservation.delete).not.toHaveBeenCalled();
    });

    it('devrait lancer BadRequestException si ID invalide', async () => {
      await expect(service.remove(0, 1, 'CLIENT')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.remove(0, 1, 'CLIENT')).rejects.toThrow(
        'ID de réservation invalide',
      );
    });

    it('devrait lancer NotFoundException si réservation non trouvée', async () => {
      mockPrismaService.reservation.findUnique.mockResolvedValue(null);

      await expect(service.remove(999, 1, 'CLIENT')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.remove(999, 1, 'CLIENT')).rejects.toThrow(
        "Réservation avec l'ID 999 non trouvée",
      );
    });

    it('devrait lancer ForbiddenException si CLIENT non propriétaire', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 15);

      const mockReservation = {
        id: 1,
        reservation_number: 'ZL-001',
        user_id: 1,
        date_id: 1,
        tickets: [],
        total_amount: 50.0,
        status: 'PENDING',
        created_at: new Date('2025-01-10'),
        updated_at: new Date('2025-01-10'),
        date: {
          id: 1,
          jour: futureDate,
          is_open: true,
          notes: null,
          created_at: new Date('2025-01-01'),
        },
      };

      mockPrismaService.reservation.findUnique.mockResolvedValue(
        mockReservation,
      );

      await expect(service.remove(1, 999, 'CLIENT')).rejects.toThrow(
        ForbiddenException,
      );
      await expect(service.remove(1, 999, 'CLIENT')).rejects.toThrow(
        'Vous ne pouvez pas annuler cette réservation',
      );
    });
  });
});
