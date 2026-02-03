import { Test, TestingModule } from '@nestjs/testing';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

describe('ActivitiesController', () => {
  let controller: ActivitiesController;
  let service: ActivitiesService;

  const mockActivitiesService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivitiesController],
      providers: [
        {
          provide: ActivitiesService,
          useValue: mockActivitiesService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<ActivitiesController>(ActivitiesController);
    service = module.get<ActivitiesService>(ActivitiesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('devrait retourner toutes les activités', async () => {
      const mockActivities = [
        { id: 1, name: 'Activity 1' },
        { id: 2, name: 'Activity 2' },
      ];

      mockActivitiesService.findAll.mockResolvedValue(mockActivities);

      const result = await controller.findAll();

      expect(result).toEqual(mockActivities);
      expect(service.findAll).toHaveBeenCalledWith({}, 'fr');
    });

    it('devrait filtrer par recherche', async () => {
      mockActivitiesService.findAll.mockResolvedValue([]);

      await controller.findAll('zombie');

      expect(service.findAll).toHaveBeenCalledWith({ search: 'zombie' }, 'fr');
    });

    it('devrait filtrer par categoryId', async () => {
      mockActivitiesService.findAll.mockResolvedValue([]);

      await controller.findAll(undefined, '1');

      expect(service.findAll).toHaveBeenCalledWith({ categoryId: 1 }, 'fr');
    });

    it('devrait filtrer par attractionId', async () => {
      mockActivitiesService.findAll.mockResolvedValue([]);

      await controller.findAll(undefined, undefined, '2');

      expect(service.findAll).toHaveBeenCalledWith({ attractionId: 2 }, 'fr');
    });

    it('devrait utiliser la langue fournie', async () => {
      mockActivitiesService.findAll.mockResolvedValue([]);

      await controller.findAll(undefined, undefined, undefined, 'en');

      expect(service.findAll).toHaveBeenCalledWith({}, 'en');
    });

    it('devrait utiliser accept-language header', async () => {
      mockActivitiesService.findAll.mockResolvedValue([]);

      await controller.findAll(
        undefined,
        undefined,
        undefined,
        undefined,
        'en-US',
      );

      expect(service.findAll).toHaveBeenCalledWith({}, 'en');
    });
  });

  describe('findOne', () => {
    it('devrait retourner une activité par ID', async () => {
      const mockActivity = { id: 1, name: 'Activity 1' };

      mockActivitiesService.findOne.mockResolvedValue(mockActivity);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockActivity);
      expect(service.findOne).toHaveBeenCalledWith(1, 'fr');
    });

    it('devrait utiliser la langue fournie', async () => {
      mockActivitiesService.findOne.mockResolvedValue({});

      await controller.findOne(1, 'en');

      expect(service.findOne).toHaveBeenCalledWith(1, 'en');
    });
  });

  describe('create', () => {
    it('devrait créer une nouvelle activité', async () => {
      const createDto = {
        name: 'New Activity',
        description: 'Description',
        category_id: 1,
      };
      const mockCreated = { id: 1, ...createDto };

      mockActivitiesService.create.mockResolvedValue(mockCreated);

      const result = await controller.create(createDto as any);

      expect(result).toEqual(mockCreated);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('devrait mettre à jour une activité', async () => {
      const updateDto = { name: 'Updated Activity' };
      const mockUpdated = { id: 1, name: 'Updated Activity' };

      mockActivitiesService.update.mockResolvedValue(mockUpdated);

      const result = await controller.update(1, updateDto as any);

      expect(result).toEqual(mockUpdated);
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('devrait supprimer une activité', async () => {
      const mockResponse = { message: 'Activité supprimée' };

      mockActivitiesService.remove.mockResolvedValue(mockResponse);

      const result = await controller.remove(1);

      expect(result).toEqual(mockResponse);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
