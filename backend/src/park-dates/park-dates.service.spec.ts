import { Test, TestingModule } from '@nestjs/testing';
import { ParkDatesService } from './park-dates.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ParkDatesService', () => {
  let service: ParkDatesService;

  const mockPrismaService = {
    parkDate: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    reservation: {
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParkDatesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ParkDatesService>(ParkDatesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('devrait retourner toutes les dates du parc', async () => {
      const mockDates = [
        {
          id: 1,
          jour: new Date('2027-12-25'),
          is_open: true,
          open_hour: new Date('1970-01-01T09:00:00'),
          close_hour: new Date('1970-01-01T22:00:00'),
          notes: 'Journée spéciale Noël',
          created_at: new Date('2025-01-01'),
        },
        {
          id: 2,
          jour: new Date('2027-12-26'),
          is_open: true,
          open_hour: new Date('1970-01-01T10:00:00'),
          close_hour: new Date('1970-01-01T20:00:00'),
          notes: null,
          created_at: new Date('2025-01-02'),
        },
      ];

      mockPrismaService.parkDate.findMany.mockResolvedValue(mockDates);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(mockPrismaService.parkDate.findMany).toHaveBeenCalled();
    });

    it('devrait filtrer par plage de dates avec from et to', async () => {
      const mockDates = [
        {
          id: 1,
          jour: new Date('2027-12-25'),
          is_open: true,
          open_hour: null,
          close_hour: null,
          notes: null,
          created_at: new Date('2025-01-01'),
        },
      ];

      mockPrismaService.parkDate.findMany.mockResolvedValue(mockDates);

      await service.findAll('2027-12-01', '2027-12-31');

      expect(mockPrismaService.parkDate.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            jour: expect.objectContaining({
              gte: expect.any(Date),
              lte: expect.any(Date),
            }),
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('devrait retourner une date par ID', async () => {
      const mockDate = {
        id: 1,
        jour: new Date('2027-12-25'),
        is_open: true,
        open_hour: new Date('1970-01-01T09:00:00'),
        close_hour: new Date('1970-01-01T22:00:00'),
        notes: 'Noël',
        created_at: new Date('2025-01-01'),
      };

      mockPrismaService.parkDate.findUnique.mockResolvedValue(mockDate);

      const result = await service.findOne(1);

      expect(result.id).toBe(1);
      expect(result.is_open).toBe(true);
    });

    it('devrait lancer NotFoundException si date non trouvée', async () => {
      mockPrismaService.parkDate.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('devrait créer une nouvelle date', async () => {
      const createDto = {
        jour: '2027-12-31',
        is_open: true,
        open_hour: '09:00',
        close_hour: '23:59',
        notes: 'Réveillon',
      };

      const mockCreatedDate = {
        id: 3,
        jour: new Date('2027-12-31'),
        is_open: true,
        open_hour: new Date('1970-01-01T09:00:00'),
        close_hour: new Date('1970-01-01T23:59:00'),
        notes: 'Réveillon',
        created_at: new Date('2025-01-03'),
      };

      mockPrismaService.parkDate.findUnique.mockResolvedValue(null);
      mockPrismaService.parkDate.create.mockResolvedValue(mockCreatedDate);

      const result = await service.create(createDto);

      expect(result.notes).toBe('Réveillon');
      expect(mockPrismaService.parkDate.create).toHaveBeenCalled();
    });

    it('devrait lancer BadRequestException si date existe déjà', async () => {
      const createDto = {
        jour: '2027-12-25',
        is_open: true,
      };

      const existingDate = {
        id: 1,
        jour: new Date('2027-12-25'),
        is_open: true,
        open_hour: null,
        close_hour: null,
        notes: null,
        created_at: new Date(),
      };

      mockPrismaService.parkDate.findUnique.mockResolvedValue(existingDate);

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(createDto)).rejects.toThrow(
        'Une date existe déjà',
      );
    });

    it('devrait lancer BadRequestException si jour manquant', async () => {
      const createDto = { is_open: true };

      await expect(service.create(createDto as any)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(createDto as any)).rejects.toThrow(
        'Le champ "jour" est obligatoire',
      );
    });
  });

  describe('update', () => {
    it('devrait mettre à jour une date', async () => {
      const existingDate = {
        id: 1,
        jour: new Date('2027-12-25'),
        is_open: true,
        open_hour: null,
        close_hour: null,
        notes: null,
        created_at: new Date('2025-01-01'),
      };

      const updateDto = {
        notes: 'Journée spéciale',
      };

      const updatedDate = {
        ...existingDate,
        notes: 'Journée spéciale',
      };

      mockPrismaService.parkDate.findUnique.mockResolvedValue(existingDate);
      mockPrismaService.parkDate.update.mockResolvedValue(updatedDate);

      const result = await service.update(1, updateDto);

      expect(result.notes).toBe('Journée spéciale');
    });

    it('devrait lancer NotFoundException si date non trouvée', async () => {
      mockPrismaService.parkDate.findUnique.mockResolvedValue(null);

      await expect(service.update(999, { notes: 'Test' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('devrait lancer BadRequestException si nouvelle date existe déjà', async () => {
      const existingDate = {
        id: 1,
        jour: new Date('2027-12-25'),
        is_open: true,
        open_hour: null,
        close_hour: null,
        notes: null,
      };

      const conflictDate = {
        id: 2,
        jour: new Date('2027-12-26'),
        is_open: true,
        open_hour: null,
        close_hour: null,
        notes: null,
      };

      mockPrismaService.parkDate.findUnique
        .mockResolvedValueOnce(existingDate)
        .mockResolvedValueOnce(conflictDate);

      await expect(service.update(1, { jour: '2027-12-26' })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('remove', () => {
    it('devrait supprimer une date sans réservations', async () => {
      const mockDate = {
        id: 1,
        jour: new Date('2027-12-25'),
        is_open: true,
        open_hour: null,
        close_hour: null,
        notes: null,
        created_at: new Date('2025-01-01'),
        _count: { reservations: 0 },
      };

      mockPrismaService.parkDate.findUnique.mockResolvedValue(mockDate);
      mockPrismaService.parkDate.delete.mockResolvedValue(mockDate);

      const result = await service.remove(1);

      expect(result.message).toContain('2027-12-25');
      expect(result.message).toContain('supprimée avec succès');
    });

    it('devrait lancer NotFoundException si date non trouvée', async () => {
      mockPrismaService.parkDate.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });

    it('devrait lancer BadRequestException si date a des réservations', async () => {
      const mockDate = {
        id: 1,
        jour: new Date('2027-12-25'),
        is_open: true,
        open_hour: null,
        close_hour: null,
        notes: null,
        created_at: new Date('2025-01-01'),
        _count: { reservations: 5 },
      };

      mockPrismaService.parkDate.findUnique.mockResolvedValue(mockDate);

      await expect(service.remove(1)).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.parkDate.delete).not.toHaveBeenCalled();
    });
  });
});
