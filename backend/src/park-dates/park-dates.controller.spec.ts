import { Test, TestingModule } from '@nestjs/testing';
import { ParkDatesController } from './park-dates.controller';
import { ParkDatesService } from './park-dates.service';

describe('ParkDatesController', () => {
  let controller: ParkDatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParkDatesController],
      providers: [ParkDatesService],
    }).compile();

    controller = module.get<ParkDatesController>(ParkDatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
