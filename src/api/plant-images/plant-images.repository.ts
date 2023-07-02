import { DataSource, Repository } from 'typeorm';
import { PlantImage } from '@/api/plant-images/plant-images.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PlantImagesRepository extends Repository<PlantImage> {
  constructor(private readonly dataSource: DataSource) {
    super(PlantImage, dataSource.createEntityManager());
  }
}
