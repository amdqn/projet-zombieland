import { Test, TestingModule } from '@nestjs/testing';
import { MapService } from './map.service';
import { PrismaService } from '../prisma/prisma.service';

describe('MapService', () => {
  let service: MapService;

  const mockPrismaService = {
    attraction: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    activity: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    pointOfInterest: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MapService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<MapService>(MapService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllMapPoints', () => {
    it('devrait retourner tous les points de la carte', async () => {
      const mockAttractions = [
        {
          id: 1,
          name: 'Zombie Coaster',
          name_en: 'Zombie Coaster',
          description: 'Montagnes russes',
          description_en: 'Roller coaster',
          latitude: 48.856613,
          longitude: 2.352222,
          thrill_level: 5,
          category: {
            id: 1,
            name: 'Frissons',
            name_en: 'Thrills',
            description: 'Sensations fortes',
            description_en: 'Strong sensations',
          },
        },
      ];

      const mockActivities = [
        {
          id: 1,
          name: 'Escape Game',
          name_en: 'Escape Game',
          description: 'Jeu d\'évasion',
          description_en: 'Escape game',
          latitude: 48.857,
          longitude: 2.353,
          thrill_level: 3,
          category: {
            id: 2,
            name: 'Aventure',
            name_en: 'Adventure',
            description: 'Activités aventure',
            description_en: 'Adventure activities',
          },
        },
      ];

      const mockPois = [
        {
          id: 1,
          name: 'Toilettes',
          name_en: 'Restrooms',
          description: 'WC',
          description_en: 'Restrooms',
          latitude: 48.858,
          longitude: 2.354,
          type: 'restroom',
          icon: 'wc',
        },
      ];

      mockPrismaService.attraction.findMany.mockResolvedValue(mockAttractions);
      mockPrismaService.activity.findMany.mockResolvedValue(mockActivities);
      mockPrismaService.pointOfInterest.findMany.mockResolvedValue(mockPois);

      const result = await service.getAllMapPoints();

      expect(result.attractions).toHaveLength(1);
      expect(result.activities).toHaveLength(1);
      expect(result.pois).toHaveLength(1);
      expect(result.attractions[0].name).toBe('Zombie Coaster');
      expect(result.attractions[0].wait_time).toBeDefined();
      expect(result.activities[0].wait_time).toBeDefined();
    });

    it('devrait retourner des tableaux vides si aucun point', async () => {
      mockPrismaService.attraction.findMany.mockResolvedValue([]);
      mockPrismaService.activity.findMany.mockResolvedValue([]);
      mockPrismaService.pointOfInterest.findMany.mockResolvedValue([]);

      const result = await service.getAllMapPoints();

      expect(result.attractions).toEqual([]);
      expect(result.activities).toEqual([]);
      expect(result.pois).toEqual([]);
    });
  });

  describe('getMapBounds', () => {
    it('devrait retourner les bornes géographiques', async () => {
      const mockAttractions = [
        { latitude: 48.856, longitude: 2.352 },
        { latitude: 48.858, longitude: 2.354 },
      ];

      const mockActivities = [
        { latitude: 48.857, longitude: 2.353 },
      ];

      const mockPois = [
        { latitude: 48.855, longitude: 2.351 },
      ];

      mockPrismaService.attraction.findMany.mockResolvedValue(mockAttractions);
      mockPrismaService.activity.findMany.mockResolvedValue(mockActivities);
      mockPrismaService.pointOfInterest.findMany.mockResolvedValue(mockPois);

      const result = await service.getMapBounds();

      expect(result).toBeDefined();
      expect(result).not.toBeNull();
      expect(result!.minLat).toBe(48.855);
      expect(result!.maxLat).toBe(48.858);
      expect(result!.minLng).toBe(2.351);
      expect(result!.maxLng).toBe(2.354);
    });

    it('devrait retourner null si aucun point', async () => {
      mockPrismaService.attraction.findMany.mockResolvedValue([]);
      mockPrismaService.activity.findMany.mockResolvedValue([]);
      mockPrismaService.pointOfInterest.findMany.mockResolvedValue([]);

      const result = await service.getMapBounds();

      expect(result).toBeNull();
    });
  });

  describe('getMapPointById', () => {
    it('devrait retourner une attraction par ID', async () => {
      const mockAttraction = {
        id: 1,
        name: 'Zombie Coaster',
        description: 'Test',
        latitude: 48.856613,
        longitude: 2.352222,
        category: { id: 1, name: 'Frissons' },
        images: [],
      };

      mockPrismaService.attraction.findUnique.mockResolvedValue(mockAttraction);

      const result = await service.getMapPointById(1, 'attraction');

      expect(result).toBeDefined();
      expect(result).not.toBeNull();
      expect(result!.id).toBe(1);
      expect(result!.name).toBe('Zombie Coaster');
    });

    it('devrait retourner une activité par ID', async () => {
      const mockActivity = {
        id: 1,
        name: 'Escape Game',
        description: 'Test',
        latitude: 48.857,
        longitude: 2.353,
        category: { id: 2, name: 'Aventure' },
        attraction: null,
      };

      mockPrismaService.activity.findUnique.mockResolvedValue(mockActivity);

      const result = await service.getMapPointById(1, 'activity');

      expect(result).toBeDefined();
      expect(result).not.toBeNull();
      expect(result!.id).toBe(1);
      expect(result!.name).toBe('Escape Game');
    });

    it('devrait retourner un POI par ID', async () => {
      const mockPoi = {
        id: 1,
        name: 'Toilettes',
        description: 'WC',
        latitude: 48.858,
        longitude: 2.354,
        type: 'restroom',
      };

      mockPrismaService.pointOfInterest.findUnique.mockResolvedValue(mockPoi);

      const result = await service.getMapPointById(1, 'poi');

      expect(result).toBeDefined();
      expect(result).not.toBeNull();
      expect(result!.id).toBe(1);
      expect(result!.name).toBe('Toilettes');
    });

    it('devrait retourner null pour un type invalide', async () => {
      const result = await service.getMapPointById(1, 'invalid' as any);

      expect(result).toBeNull();
    });
  });
});
