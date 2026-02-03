import { Test, TestingModule } from '@nestjs/testing';
import { ParkDatesController } from './park-dates.controller';
import { ParkDatesService } from './park-dates.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ParkDatesController', () => {
  let controller: ParkDatesController;

  const mockPrismaService = {
    parkDate: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParkDatesController],
      providers: [
        ParkDatesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    controller = module.get<ParkDatesController>(ParkDatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
