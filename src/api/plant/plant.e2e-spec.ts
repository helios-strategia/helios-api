import { Test, TestingModule } from '@nestjs/testing';
import { PlantController } from '@/api/plant/plant.controller';
import { PlantService } from '@/api/plant/plant.service';
import { INestApplication } from '@nestjs/common';
import { PlantRepository } from '@/api/plant/plant.repository';
import { AppModule } from '@/app.module';
import * as request from 'supertest';

describe('PlantController', () => {
  let app: any;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /my-data', () => {
    it('should return my data', async () => {
      const res = await request(app.getHttpServer()).get('/my-data');

      expect(res.status).toBe(401);
    });
  });
});
