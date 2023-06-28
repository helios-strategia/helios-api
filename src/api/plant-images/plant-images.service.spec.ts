import { Test, TestingModule } from '@nestjs/testing';
import { PlantImagesService } from './plant-images.service';

describe('PlantImagesService', () => {
  let service: PlantImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlantImagesService],
    }).compile();

    service = module.get<PlantImagesService>(PlantImagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
