import { Test, TestingModule } from '@nestjs/testing';
import { ParkDatesService } from './park-dates.service';

describe('ParkDatesService', () => {
  let service: ParkDatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParkDatesService],
    }).compile();

    service = module.get<ParkDatesService>(ParkDatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
