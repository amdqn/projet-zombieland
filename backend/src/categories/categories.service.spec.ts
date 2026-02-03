import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';

describe('CategoriesService', () => {
  let service: CategoriesService;

  const mockPrismaService = {
    category: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    attraction: {
      count: jest.fn(),
    },
    activity: {
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('devrait retourner toutes les catégories', async () => {
      const mockCategories = [
        {
          id: 1,
          name: 'Frissons',
          name_en: 'Thrills',
          description: 'Attractions à sensations fortes',
          description_en: 'Thrilling attractions',
          created_at: new Date('2025-01-01'),
          updated_at: new Date('2025-01-01'),
          _count: { attractions: 5, activities: 2 },
        },
        {
          id: 2,
          name: 'Famille',
          name_en: 'Family',
          description: 'Attractions familiales',
          description_en: 'Family attractions',
          created_at: new Date('2025-01-02'),
          updated_at: new Date('2025-01-02'),
          _count: { attractions: 3, activities: 1 },
        },
      ];

      mockPrismaService.category.findMany.mockResolvedValue(mockCategories);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Frissons');
      expect(mockPrismaService.category.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('devrait retourner une catégorie avec ses attractions et activités', async () => {
      const mockCategory = {
        id: 1,
        name: 'Frissons',
        name_en: 'Thrills',
        description: 'Attractions à sensations fortes',
        description_en: 'Thrilling attractions',
        created_at: new Date('2025-01-01'),
        updated_at: new Date('2025-01-01'),
        attractions: [{ id: 1, name: 'Zombie Coaster', description: 'Montagnes russes', image_url: null }],
        activities: [],
        _count: { attractions: 1, activities: 0 },
      };

      mockPrismaService.category.findUnique.mockResolvedValue(mockCategory);

      const result = await service.findOne(1);

      expect(result.id).toBe(1);
      expect(result.attractions).toHaveLength(1);
    });

    it('devrait lancer NotFoundException si catégorie non trouvée', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('devrait créer une nouvelle catégorie', async () => {
      const createDto = {
        name: 'Horreur',
        name_en: 'Horror',
        description: 'Attractions horrifiques',
        description_en: 'Horror attractions',
      };

      const mockCreatedCategory = {
        id: 3,
        ...createDto,
        created_at: new Date('2025-01-03'),
        updated_at: new Date('2025-01-03'),
        _count: { attractions: 0, activities: 0 },
      };

      mockPrismaService.category.findUnique.mockResolvedValue(null);
      mockPrismaService.category.create.mockResolvedValue(mockCreatedCategory);

      const result = await service.create(createDto);

      expect(result.name).toBe('Horreur');
      expect(mockPrismaService.category.create).toHaveBeenCalled();
    });

    it('devrait lancer ConflictException si nom existe déjà', async () => {
      const createDto = {
        name: 'Frissons',
        description: 'Test',
      };

      const existingCategory = {
        id: 1,
        name: 'Frissons',
        description: 'Existing',
        created_at: new Date(),
      };

      mockPrismaService.category.findUnique.mockResolvedValue(existingCategory);

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
      expect(mockPrismaService.category.create).not.toHaveBeenCalled();
    });

    it('devrait lancer BadRequestException si champs requis manquants', async () => {
      const createDto = { name: 'Test' };

      await expect(service.create(createDto as any)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('devrait mettre à jour une catégorie', async () => {
      const existingCategory = {
        id: 1,
        name: 'Frissons',
        description: 'Old description',
        created_at: new Date('2025-01-01'),
        updated_at: new Date('2025-01-01'),
      };

      const updateDto = {
        description: 'New description',
      };

      const updatedCategory = {
        ...existingCategory,
        description: 'New description',
        updated_at: new Date('2025-01-05'),
        _count: { attractions: 5, activities: 2 },
      };

      mockPrismaService.category.findUnique.mockResolvedValue(existingCategory);
      mockPrismaService.category.update.mockResolvedValue(updatedCategory);

      const result = await service.update(1, updateDto);

      expect(result.description).toBe('New description');
      expect(mockPrismaService.category.update).toHaveBeenCalled();
    });

    it('devrait lancer NotFoundException si catégorie non trouvée', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(null);

      await expect(service.update(999, { description: 'Test' })).rejects.toThrow(NotFoundException);
    });

    it('devrait lancer ConflictException si nouveau nom existe déjà', async () => {
      const existingCategory = {
        id: 1,
        name: 'Frissons',
        description: 'Test',
      };

      const conflictCategory = {
        id: 2,
        name: 'Famille',
        description: 'Test',
      };

      mockPrismaService.category.findUnique
        .mockResolvedValueOnce(existingCategory)
        .mockResolvedValueOnce(conflictCategory);

      await expect(service.update(1, { name: 'Famille' })).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('devrait supprimer une catégorie sans attractions/activités', async () => {
      const mockCategory = {
        id: 1,
        name: 'Frissons',
        description: 'Test',
        created_at: new Date('2025-01-01'),
        _count: { attractions: 0, activities: 0 },
      };

      mockPrismaService.category.findUnique.mockResolvedValue(mockCategory);
      mockPrismaService.category.delete.mockResolvedValue(mockCategory);

      const result = await service.remove(1);

      expect(result.message).toContain('Frissons');
      expect(result.message).toContain('supprimée avec succès');
    });

    it('devrait lancer NotFoundException si catégorie non trouvée', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });

    it('devrait lancer BadRequestException si catégorie utilisée', async () => {
      const mockCategory = {
        id: 1,
        name: 'Frissons',
        description: 'Test',
        created_at: new Date('2025-01-01'),
        _count: { attractions: 5, activities: 2 },
      };

      mockPrismaService.category.findUnique.mockResolvedValue(mockCategory);

      await expect(service.remove(1)).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.category.delete).not.toHaveBeenCalled();
    });
  });
});
