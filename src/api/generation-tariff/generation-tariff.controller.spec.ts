import { Test, TestingModule } from '@nestjs/testing';
import { GenerationTariffController } from './generation-tariff.controller';

describe('GenerationTariffController', () => {
  let controller: GenerationTariffController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenerationTariffController],
    }).compile();

    controller = module.get<GenerationTariffController>(
      GenerationTariffController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
