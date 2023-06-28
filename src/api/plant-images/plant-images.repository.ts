import { DataSource, Repository } from 'typeorm';
import { PlantImages } from '@/api/plant-images/plant-images.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PlantImagesRepository extends Repository<PlantImages> {
  constructor(private readonly dataSource: DataSource) {
    super(PlantImages, dataSource.createEntityManager());
  }
}
