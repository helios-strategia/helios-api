import { Test, TestingModule } from '@nestjs/testing';
import { GenerationTariffService } from './generation-tariff.service';

describe('GenerationTariffService', () => {
  let service: GenerationTariffService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GenerationTariffService],
    }).compile();

    service = module.get<GenerationTariffService>(GenerationTariffService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
