import { Module } from '@nestjs/common';
import { PlantImagesService } from './plant-images.service';
import { PlantImagesRepository } from '@/api/plant-images/plant-images.repository';
import { PlantImagesProfile } from '@/api/plant-images/plant-images.profile';

@Module({
  providers: [PlantImagesService, PlantImagesRepository, PlantImagesProfile],
  exports: [PlantImagesService],
})
export class PlantImagesModule {}
