import { Test, TestingModule } from '@nestjs/testing';
import { MapController } from './map.controller';
import { MapService } from './map.service';

describe('MapController', () => {
  let controller: MapController;
  let service: MapService;

  const mockMapService = {
    getAllMapPoints: jest.fn(),
    getMapBounds: jest.fn(),
    getMapPointById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MapController],
      providers: [
        {
          provide: MapService,
          useValue: mockMapService,
        },
      ],
    }).compile();

    controller = module.get<MapController>(MapController);
    service = module.get<MapService>(MapService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllMapPoints', () => {
    it('devrait retourner tous les points de la carte', async () => {
      const mockPoints = {
        attractions: [{ id: 1, name: 'Attraction 1' }],
        activities: [{ id: 1, name: 'Activity 1' }],
        pois: [{ id: 1, name: 'POI 1' }],
      };

      mockMapService.getAllMapPoints.mockResolvedValue(mockPoints);

      const result = await controller.getAllMapPoints();

      expect(result).toEqual(mockPoints);
      expect(service.getAllMapPoints).toHaveBeenCalledWith('fr');
    });

    it('devrait utiliser la langue fournie via query param', async () => {
      mockMapService.getAllMapPoints.mockResolvedValue({
        attractions: [],
        activities: [],
        pois: [],
      });

      await controller.getAllMapPoints('en');

      expect(service.getAllMapPoints).toHaveBeenCalledWith('en');
    });

    it('devrait utiliser accept-language header', async () => {
      mockMapService.getAllMapPoints.mockResolvedValue({
        attractions: [],
        activities: [],
        pois: [],
      });

      await controller.getAllMapPoints(undefined, 'en-US');

      expect(service.getAllMapPoints).toHaveBeenCalledWith('en');
    });

    it('devrait préférer query param sur header', async () => {
      mockMapService.getAllMapPoints.mockResolvedValue({
        attractions: [],
        activities: [],
        pois: [],
      });

      await controller.getAllMapPoints('en', 'fr-FR');

      expect(service.getAllMapPoints).toHaveBeenCalledWith('en');
    });
  });

  describe('getMapBounds', () => {
    it('devrait retourner les bornes géographiques', async () => {
      const mockBounds = {
        minLat: 48.855,
        maxLat: 48.858,
        minLng: 2.351,
        maxLng: 2.354,
      };

      mockMapService.getMapBounds.mockResolvedValue(mockBounds);

      const result = await controller.getMapBounds();

      expect(result).toEqual(mockBounds);
      expect(service.getMapBounds).toHaveBeenCalled();
    });

    it('devrait retourner null si aucun point', async () => {
      mockMapService.getMapBounds.mockResolvedValue(null);

      const result = await controller.getMapBounds();

      expect(result).toBeNull();
    });
  });

  describe('getMapPointById', () => {
    it('devrait retourner un point de type attraction', async () => {
      const mockPoint = { id: 1, name: 'Attraction 1', type: 'attraction' };

      mockMapService.getMapPointById.mockResolvedValue(mockPoint);

      const result = await controller.getMapPointById(1, 'attraction');

      expect(result).toEqual(mockPoint);
      expect(service.getMapPointById).toHaveBeenCalledWith(1, 'attraction');
    });

    it('devrait retourner un point de type activity', async () => {
      const mockPoint = { id: 2, name: 'Activity 1', type: 'activity' };

      mockMapService.getMapPointById.mockResolvedValue(mockPoint);

      const result = await controller.getMapPointById(2, 'activity');

      expect(result).toEqual(mockPoint);
      expect(service.getMapPointById).toHaveBeenCalledWith(2, 'activity');
    });

    it('devrait retourner un point de type poi', async () => {
      const mockPoint = { id: 3, name: 'Toilettes', type: 'poi' };

      mockMapService.getMapPointById.mockResolvedValue(mockPoint);

      const result = await controller.getMapPointById(3, 'poi');

      expect(result).toEqual(mockPoint);
      expect(service.getMapPointById).toHaveBeenCalledWith(3, 'poi');
    });
  });
});
