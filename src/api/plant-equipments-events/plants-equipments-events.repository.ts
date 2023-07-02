import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { PlantEquipmentsEvents } from '@/api/plant-equipments-events/plants-equipments-events.entity';

@Injectable()
export class PlantsEquipmentsEventsRepository extends Repository<PlantEquipmentsEvents> {
  public constructor(private readonly dataSource: DataSource) {
    super(PlantEquipmentsEvents, dataSource.createEntityManager());
  }
}
