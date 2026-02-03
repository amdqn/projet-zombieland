import { Test, TestingModule } from '@nestjs/testing';
import { AttractionsController } from './attractions.controller';
import { AttractionsService } from './attractions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

describe('AttractionsController', () => {
  let controller: AttractionsController;
  let service: AttractionsService;

  const mockAttractionsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttractionsController],
      providers: [
        {
          provide: AttractionsService,
          useValue: mockAttractionsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<AttractionsController>(AttractionsController);
    service = module.get<AttractionsService>(AttractionsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('devrait retourner toutes les attractions', async () => {
      const mockAttractions = [
        { id: 1, name: 'Attraction 1' },
        { id: 2, name: 'Attraction 2' },
      ];

      mockAttractionsService.findAll.mockResolvedValue(mockAttractions);

      const result = await controller.findAll();

      expect(result).toEqual(mockAttractions);
      expect(service.findAll).toHaveBeenCalledWith({}, 'fr');
    });

    it('devrait filtrer par recherche', async () => {
      mockAttractionsService.findAll.mockResolvedValue([]);

      await controller.findAll('coaster');

      expect(service.findAll).toHaveBeenCalledWith(
        { search: 'coaster' },
        'fr',
      );
    });

    it('devrait filtrer par categoryId', async () => {
      mockAttractionsService.findAll.mockResolvedValue([]);

      await controller.findAll(undefined, '1');

      expect(service.findAll).toHaveBeenCalledWith(
        { categoryId: 1 },
        'fr',
      );
    });

    it('devrait utiliser la langue fournie', async () => {
      mockAttractionsService.findAll.mockResolvedValue([]);

      await controller.findAll(undefined, undefined, 'en');

      expect(service.findAll).toHaveBeenCalledWith({}, 'en');
    });

    it('devrait combiner plusieurs filtres', async () => {
      mockAttractionsService.findAll.mockResolvedValue([]);

      await controller.findAll('zombie', '2', 'en');

      expect(service.findAll).toHaveBeenCalledWith(
        { search: 'zombie', categoryId: 2 },
        'en',
      );
    });
  });

  describe('findOne', () => {
    it('devrait retourner une attraction par ID', async () => {
      const mockAttraction = { id: 1, name: 'Attraction 1' };

      mockAttractionsService.findOne.mockResolvedValue(mockAttraction);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockAttraction);
      expect(service.findOne).toHaveBeenCalledWith(1, 'fr');
    });

    it('devrait utiliser la langue fournie', async () => {
      mockAttractionsService.findOne.mockResolvedValue({});

      await controller.findOne(1, 'en');

      expect(service.findOne).toHaveBeenCalledWith(1, 'en');
    });

    it('devrait utiliser accept-language header', async () => {
      mockAttractionsService.findOne.mockResolvedValue({});

      await controller.findOne(1, undefined, 'en-GB');

      expect(service.findOne).toHaveBeenCalledWith(1, 'en');
    });
  });

  describe('create', () => {
    it('devrait créer une nouvelle attraction', async () => {
      const createDto = {
        name: 'New Attraction',
        description: 'Description',
        category_id: 1,
      };
      const mockCreated = { id: 1, ...createDto };

      mockAttractionsService.create.mockResolvedValue(mockCreated);

      const result = await controller.create(createDto as any);

      expect(result).toEqual(mockCreated);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('devrait mettre à jour une attraction', async () => {
      const updateDto = { name: 'Updated Attraction' };
      const mockUpdated = { id: 1, name: 'Updated Attraction' };

      mockAttractionsService.update.mockResolvedValue(mockUpdated);

      const result = await controller.update(1, updateDto as any);

      expect(result).toEqual(mockUpdated);
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('devrait supprimer une attraction', async () => {
      const mockResponse = { message: 'Attraction supprimée' };

      mockAttractionsService.remove.mockResolvedValue(mockResponse);

      const result = await controller.remove(1);

      expect(result).toEqual(mockResponse);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
