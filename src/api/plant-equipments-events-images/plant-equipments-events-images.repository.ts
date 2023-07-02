import { DataSource, Repository } from 'typeorm';
import { PlantEquipmentsEventsImage } from '@/api/plant-equipments-events-images/plant-equipments-events-images.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PlantEquipmentsEventsImagesRepository extends Repository<PlantEquipmentsEventsImage> {
  public constructor(private readonly dataSource: DataSource) {
    super(PlantEquipmentsEventsImage, dataSource.createEntityManager());
  }
}
