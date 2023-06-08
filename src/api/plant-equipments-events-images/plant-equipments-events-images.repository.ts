import { DataSource, Repository } from 'typeorm';
import { PlantEquipmentsEventsImages } from '@/api/plant-equipments-events-images/plant-equipments-events-images.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PlantEquipmentsEventsImagesRepository extends Repository<PlantEquipmentsEventsImages> {
  public constructor(private readonly dataSource: DataSource) {
    super(PlantEquipmentsEventsImages, dataSource.createEntityManager());
  }
}
