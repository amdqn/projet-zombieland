import { Test, TestingModule } from '@nestjs/testing';
import { PricesService } from './prices.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('PricesService', () => {
  let service: PricesService;

  const mockPrismaService = {
    price: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PricesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PricesService>(PricesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('devrait retourner tous les tarifs avec pagination', async () => {
      const mockPrices = [
        {
          id: 1,
          label: 'Adulte',
          label_en: 'Adult',
          type: 'ADULTE',
          amount: 50.0,
          duration_days: 1,
          created_at: new Date('2025-01-01'),
          updated_at: new Date('2025-01-01'),
        },
        {
          id: 2,
          label: 'Enfant',
          label_en: 'Child',
          type: 'ENFANT',
          amount: 25.0,
          duration_days: 1,
          created_at: new Date('2025-01-02'),
          updated_at: new Date('2025-01-02'),
        },
      ];

      mockPrismaService.price.findMany.mockResolvedValue(mockPrices);
      mockPrismaService.price.count.mockResolvedValue(2);

      const result = await service.findAll();

      expect(result.data).toHaveLength(2);
      expect(result.pagination.total).toBe(2);
      expect(result.pagination.page).toBe(1);
      expect(mockPrismaService.price.findMany).toHaveBeenCalled();
      expect(mockPrismaService.price.count).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('devrait retourner un tarif par ID', async () => {
      const mockPrice = {
        id: 1,
        label: 'Adulte',
        label_en: 'Adult',
        type: 'ADULTE',
        amount: 50.0,
        duration_days: 1,
        created_at: new Date('2025-01-01'),
        updated_at: new Date('2025-01-01'),
      };

      mockPrismaService.price.findUnique.mockResolvedValue(mockPrice);

      const result = await service.findOne(1);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.label).toBe('Adulte');
    });

    it('devrait lancer NotFoundException si tarif non trouvé', async () => {
      mockPrismaService.price.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('devrait créer un nouveau tarif', async () => {
      const createDto = {
        label: 'Senior',
        label_en: 'Senior',
        type: 'SENIOR',
        amount: 40.0,
        duration_days: 1,
      };

      const mockCreatedPrice = {
        id: 3,
        ...createDto,
        created_at: new Date('2025-01-03'),
        updated_at: new Date('2025-01-03'),
      };

      mockPrismaService.price.create.mockResolvedValue(mockCreatedPrice);

      const result = await service.create(createDto);

      expect(result).toBeDefined();
      expect(result.label).toBe('Senior');
      expect(mockPrismaService.price.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          label: 'Senior',
          type: 'SENIOR',
          amount: 40.0,
        }),
      });
    });

    it('devrait lancer BadRequestException si amount <= 0', async () => {
      const createDto = {
        label: 'Test',
        type: 'ADULTE',
        amount: -10,
        duration_days: 1,
      };

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
      await expect(service.create(createDto)).rejects.toThrow('Le montant doit être supérieur à 0');
    });

    it('devrait lancer BadRequestException si duration_days < 1', async () => {
      const createDto = {
        label: 'Test',
        label_en: 'Test',
        type: 'ADULTE',
        amount: 50,
        duration_days: -1,
      };

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
      await expect(service.create(createDto)).rejects.toThrow('La durée doit être au moins 1 jour');
    });
  });

  describe('update', () => {
    it('devrait mettre à jour un tarif', async () => {
      const existingPrice = {
        id: 1,
        label: 'Adulte',
        label_en: 'Adult',
        type: 'ADULTE',
        amount: 50.0,
        duration_days: 1,
        created_at: new Date('2025-01-01'),
        updated_at: new Date('2025-01-01'),
      };

      const updateDto = {
        amount: 55.0,
      };

      const updatedPrice = {
        ...existingPrice,
        amount: 55.0,
        updated_at: new Date('2025-01-05'),
      };

      mockPrismaService.price.findUnique.mockResolvedValue(existingPrice);
      mockPrismaService.price.update.mockResolvedValue(updatedPrice);

      const result = await service.update(1, updateDto);

      expect(result.amount).toBe(55.0);
      expect(mockPrismaService.price.update).toHaveBeenCalled();
    });

    it('devrait lancer NotFoundException si tarif non trouvé', async () => {
      mockPrismaService.price.findUnique.mockResolvedValue(null);

      await expect(service.update(999, { amount: 60 })).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.price.update).not.toHaveBeenCalled();
    });

    it('devrait lancer BadRequestException si amount <= 0', async () => {
      const existingPrice = {
        id: 1,
        label: 'Adulte',
        type: 'ADULTE',
        amount: 50.0,
        duration_days: 1,
      };

      mockPrismaService.price.findUnique.mockResolvedValue(existingPrice);

      await expect(service.update(1, { amount: -5 })).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.price.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('devrait supprimer un tarif', async () => {
      const mockPrice = {
        id: 1,
        label: 'Adulte',
        label_en: 'Adult',
        type: 'ADULTE',
        amount: 50.0,
        duration_days: 1,
        created_at: new Date('2025-01-01'),
        updated_at: new Date('2025-01-01'),
      };

      mockPrismaService.price.findUnique.mockResolvedValue(mockPrice);
      mockPrismaService.price.delete.mockResolvedValue(mockPrice);

      const result = await service.remove(1);

      expect(result.message).toContain('Adulte');
      expect(result.message).toContain('supprimé avec succès');
      expect(mockPrismaService.price.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('devrait lancer NotFoundException si tarif non trouvé', async () => {
      mockPrismaService.price.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.price.delete).not.toHaveBeenCalled();
    });
  });
});
