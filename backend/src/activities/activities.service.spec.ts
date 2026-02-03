import { Test, TestingModule } from '@nestjs/testing';
import { ActivitiesService } from './activities.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ActivitiesService', () => {
  let service: ActivitiesService;

  const mockPrismaService = {
    activity: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    category: {
      findUnique: jest.fn(),
    },
    attraction: {
      findUnique: jest.fn(),
    },
    activityRelation: {
      deleteMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivitiesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ActivitiesService>(ActivitiesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('devrait retourner toutes les activités', async () => {
      const mockActivities = [
        {
          id: 1,
          name: 'Escape Game Zombie',
          name_en: 'Zombie Escape Game',
          description: 'Échappez-vous des zombies',
          description_en: 'Escape from zombies',
          category_id: 1,
          attraction_id: null,
          image_url: '/images/escape.jpg',
          thrill_level: 3,
          duration: 60,
          min_age: 12,
          accessibility: 'Accessible',
          is_published: true,
          created_at: new Date('2025-01-01'),
          updated_at: new Date('2025-01-01'),
          category: {
            id: 1,
            name: 'Aventure',
            name_en: 'Adventure',
            description: 'Activités aventure',
            description_en: 'Adventure activities',
            created_at: new Date('2025-01-01'),
            updated_at: new Date('2025-01-01'),
          },
          attraction: null,
          relatedFrom: [],
        },
      ];

      mockPrismaService.activity.findMany.mockResolvedValue(mockActivities);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Escape Game Zombie');
      expect(mockPrismaService.activity.findMany).toHaveBeenCalled();
    });

    it('devrait filtrer par recherche', async () => {
      mockPrismaService.activity.findMany.mockResolvedValue([]);

      await service.findAll({ search: 'zombie' });

      expect(mockPrismaService.activity.findMany).toHaveBeenCalledWith(
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
      mockPrismaService.activity.findMany.mockResolvedValue([]);

      await service.findAll({ categoryId: 1 });

      expect(mockPrismaService.activity.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ category_id: 1 }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('devrait retourner une activité par ID', async () => {
      const mockActivity = {
        id: 1,
        name: 'Escape Game',
        name_en: 'Escape Game',
        description: 'Test',
        description_en: 'Test',
        category_id: 1,
        attraction_id: null,
        image_url: null,
        thrill_level: 3,
        duration: 60,
        min_age: 12,
        accessibility: null,
        is_published: true,
        created_at: new Date('2025-01-01'),
        updated_at: new Date('2025-01-01'),
        category: {
          id: 1,
          name: 'Aventure',
          description: 'Test',
          created_at: new Date('2025-01-01'),
          updated_at: new Date('2025-01-01'),
        },
        attraction: null,
        relatedFrom: [],
      };

      mockPrismaService.activity.findUnique.mockResolvedValue(mockActivity);

      const result = await service.findOne(1);

      expect(result.id).toBe(1);
      expect(result.name).toBe('Escape Game');
    });

    it('devrait lancer NotFoundException si activité non trouvée', async () => {
      mockPrismaService.activity.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });

    it('devrait lancer BadRequestException pour ID invalide', async () => {
      await expect(service.findOne(0)).rejects.toThrow(BadRequestException);
      await expect(service.findOne(-1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('create', () => {
    it('devrait créer une nouvelle activité', async () => {
      const createDto = {
        name: 'Nouvelle Activité',
        name_en: 'New Activity',
        description: 'Description',
        description_en: 'Description',
        category_id: 1,
      };

      const mockCategory = {
        id: 1,
        name: 'Aventure',
        description: 'Test',
        created_at: new Date(),
        updated_at: new Date(),
      };

      const mockCreatedActivity = {
        id: 2,
        ...createDto,
        attraction_id: null,
        image_url: null,
        thrill_level: null,
        duration: null,
        min_age: null,
        accessibility: null,
        is_published: true,
        created_at: new Date('2025-01-02'),
        updated_at: new Date('2025-01-02'),
        category: mockCategory,
        attraction: null,
        relatedFrom: [],
      };

      mockPrismaService.category.findUnique.mockResolvedValue(mockCategory);
      mockPrismaService.activity.create.mockResolvedValue(mockCreatedActivity);

      const result = await service.create(createDto);

      expect(result.name).toBe('Nouvelle Activité');
      expect(mockPrismaService.activity.create).toHaveBeenCalled();
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
      await expect(service.create(createDto)).rejects.toThrow(
        "Catégorie avec l'ID 999 non trouvée",
      );
    });

    it('devrait lancer NotFoundException si attraction non trouvée', async () => {
      const createDto = {
        name: 'Test',
        description: 'Test',
        category_id: 1,
        attraction_id: 999,
      };

      const mockCategory = { id: 1, name: 'Test', description: 'Test' };

      mockPrismaService.category.findUnique.mockResolvedValue(mockCategory);
      mockPrismaService.attraction.findUnique.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.create(createDto)).rejects.toThrow(
        "Attraction avec l'ID 999 non trouvée",
      );
    });
  });

  describe('update', () => {
    it('devrait mettre à jour une activité', async () => {
      const existingActivity = {
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

      const updatedActivity = {
        ...existingActivity,
        name: 'New Name',
        updated_at: new Date('2025-01-05'),
        category: {
          id: 1,
          name: 'Aventure',
          description: 'Test',
          created_at: new Date('2025-01-01'),
          updated_at: new Date('2025-01-01'),
        },
        attraction: null,
        relatedFrom: [],
      };

      mockPrismaService.activity.findUnique.mockResolvedValue(existingActivity);
      mockPrismaService.activity.update.mockResolvedValue(updatedActivity);

      const result = await service.update(1, updateDto);

      expect(result.name).toBe('New Name');
    });

    it('devrait lancer NotFoundException si activité non trouvée', async () => {
      mockPrismaService.activity.findUnique.mockResolvedValue(null);

      await expect(service.update(999, { name: 'Test' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('devrait lancer BadRequestException pour ID invalide', async () => {
      await expect(service.update(0, { name: 'Test' })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('devrait lancer NotFoundException si nouvelle catégorie non trouvée', async () => {
      const existingActivity = {
        id: 1,
        name: 'Test',
        description: 'Test',
        category_id: 1,
      };

      mockPrismaService.activity.findUnique.mockResolvedValue(existingActivity);
      mockPrismaService.category.findUnique.mockResolvedValue(null);

      await expect(service.update(1, { category_id: 999 })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('devrait supprimer une activité', async () => {
      const mockActivity = {
        id: 1,
        name: 'Test',
        description: 'Test',
        category_id: 1,
      };

      mockPrismaService.activity.findUnique.mockResolvedValue(mockActivity);
      mockPrismaService.activity.delete.mockResolvedValue(mockActivity);

      const result = await service.remove(1);

      expect(result.message).toContain('supprimée avec succès');
      expect(mockPrismaService.activity.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('devrait lancer NotFoundException si activité non trouvée', async () => {
      mockPrismaService.activity.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });

    it('devrait lancer BadRequestException pour ID invalide', async () => {
      await expect(service.remove(0)).rejects.toThrow(BadRequestException);
    });
  });
});
