import { Test, TestingModule } from '@nestjs/testing';
import { AttractionsService } from './attractions.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('AttractionsService', () => {
  let service: AttractionsService;

  const mockPrismaService = {
    attraction: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    category: {
      findUnique: jest.fn(),
    },
    attractionRelation: {
      deleteMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttractionsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AttractionsService>(AttractionsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('devrait retourner toutes les attractions', async () => {
      const mockAttractions = [
        {
          id: 1,
          name: 'Zombie Coaster',
          name_en: 'Zombie Coaster',
          description: 'Montagnes russes terrifiantes',
          description_en: 'Terrifying roller coaster',
          category_id: 1,
          image_url: '/images/coaster.jpg',
          thrill_level: 5,
          duration: 3,
          min_age: 14,
          min_height: 140,
          accessibility: 'Non accessible',
          is_published: true,
          latitude: 48.856613,
          longitude: 2.352222,
          created_at: new Date('2025-01-01'),
          updated_at: new Date('2025-01-01'),
          category: {
            id: 1,
            name: 'Frissons',
            name_en: 'Thrills',
            description: 'Sensations fortes',
            description_en: 'Strong sensations',
            created_at: new Date('2025-01-01'),
            updated_at: new Date('2025-01-01'),
          },
          images: [],
          activities: [],
          relatedFrom: [],
        },
      ];

      mockPrismaService.attraction.findMany.mockResolvedValue(mockAttractions);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Zombie Coaster');
      expect(result[0].wait_time).toBeDefined();
      expect(mockPrismaService.attraction.findMany).toHaveBeenCalled();
    });

    it('devrait filtrer par recherche', async () => {
      mockPrismaService.attraction.findMany.mockResolvedValue([]);

      await service.findAll({ search: 'zombie' });

      expect(mockPrismaService.attraction.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({ name: expect.any(Object) }),
            ]),
          }),
        }),
      );
    });

    it('devrait filtrer par catégorie', async () => {
      mockPrismaService.attraction.findMany.mockResolvedValue([]);

      await service.findAll({ categoryId: 1 });

      expect(mockPrismaService.attraction.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ category_id: 1 }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('devrait retourner une attraction par ID', async () => {
      const mockAttraction = {
        id: 1,
        name: 'Zombie Coaster',
        name_en: 'Zombie Coaster',
        description: 'Test',
        description_en: 'Test',
        category_id: 1,
        image_url: null,
        thrill_level: 5,
        duration: 3,
        min_age: 14,
        min_height: 140,
        accessibility: null,
        is_published: true,
        latitude: 48.856613,
        longitude: 2.352222,
        created_at: new Date('2025-01-01'),
        updated_at: new Date('2025-01-01'),
        category: {
          id: 1,
          name: 'Frissons',
          description: 'Test',
          created_at: new Date('2025-01-01'),
          updated_at: new Date('2025-01-01'),
        },
        images: [],
        activities: [],
        relatedFrom: [],
      };

      mockPrismaService.attraction.findUnique.mockResolvedValue(mockAttraction);

      const result = await service.findOne(1);

      expect(result.id).toBe(1);
      expect(result.name).toBe('Zombie Coaster');
      expect(result.wait_time).toBeDefined();
    });

    it('devrait lancer NotFoundException si attraction non trouvée', async () => {
      mockPrismaService.attraction.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });

    it('devrait lancer BadRequestException pour ID invalide', async () => {
      await expect(service.findOne(0)).rejects.toThrow(BadRequestException);
      await expect(service.findOne(-1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('create', () => {
    it('devrait créer une nouvelle attraction', async () => {
      const createDto = {
        name: 'Nouvelle Attraction',
        name_en: 'New Attraction',
        description: 'Description',
        description_en: 'Description',
        category_id: 1,
        latitude: 48.856613,
        longitude: 2.352222,
      };

      const mockCategory = {
        id: 1,
        name: 'Frissons',
        description: 'Test',
        created_at: new Date(),
        updated_at: new Date(),
      };

      const mockCreatedAttraction = {
        id: 2,
        ...createDto,
        image_url: null,
        thrill_level: null,
        duration: null,
        min_age: null,
        min_height: null,
        accessibility: null,
        is_published: true,
        created_at: new Date('2025-01-02'),
        updated_at: new Date('2025-01-02'),
        category: mockCategory,
        images: [],
        activities: [],
        relatedFrom: [],
      };

      mockPrismaService.category.findUnique.mockResolvedValue(mockCategory);
      mockPrismaService.attraction.create.mockResolvedValue(
        mockCreatedAttraction,
      );

      const result = await service.create(createDto);

      expect(result.name).toBe('Nouvelle Attraction');
      expect(mockPrismaService.attraction.create).toHaveBeenCalled();
    });

    it('devrait lancer BadRequestException si champs requis manquants', async () => {
      const createDto = { name: 'Test' };

      await expect(service.create(createDto as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('devrait lancer NotFoundException si catégorie non trouvée', async () => {
      const createDto = {
        name: 'Test',
        description: 'Test',
        category_id: 999,
      };

      mockPrismaService.category.findUnique.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('devrait mettre à jour une attraction', async () => {
      const existingAttraction = {
        id: 1,
        name: 'Old Name',
        description: 'Old description',
        category_id: 1,
        created_at: new Date('2025-01-01'),
        updated_at: new Date('2025-01-01'),
      };

      const updateDto = {
        name: 'New Name',
      };

      const updatedAttraction = {
        ...existingAttraction,
        name: 'New Name',
        updated_at: new Date('2025-01-05'),
        category: {
          id: 1,
          name: 'Frissons',
          description: 'Test',
          created_at: new Date('2025-01-01'),
          updated_at: new Date('2025-01-01'),
        },
        images: [],
        activities: [],
        relatedFrom: [],
      };

      mockPrismaService.attraction.findUnique.mockResolvedValue(
        existingAttraction,
      );
      mockPrismaService.attraction.update.mockResolvedValue(updatedAttraction);

      const result = await service.update(1, updateDto);

      expect(result.name).toBe('New Name');
    });

    it('devrait lancer NotFoundException si attraction non trouvée', async () => {
      mockPrismaService.attraction.findUnique.mockResolvedValue(null);

      await expect(service.update(999, { name: 'Test' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('devrait lancer BadRequestException pour ID invalide', async () => {
      await expect(service.update(0, { name: 'Test' })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('remove', () => {
    it('devrait supprimer une attraction', async () => {
      const mockAttraction = {
        id: 1,
        name: 'Test',
        description: 'Test',
        category_id: 1,
      };

      mockPrismaService.attraction.findUnique.mockResolvedValue(mockAttraction);
      mockPrismaService.attraction.delete.mockResolvedValue(mockAttraction);

      const result = await service.remove(1);

      expect(result.message).toContain('supprimée avec succès');
      expect(mockPrismaService.attraction.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('devrait lancer NotFoundException si attraction non trouvée', async () => {
      mockPrismaService.attraction.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });

    it('devrait lancer BadRequestException pour ID invalide', async () => {
      await expect(service.remove(0)).rejects.toThrow(BadRequestException);
    });
  });
});
