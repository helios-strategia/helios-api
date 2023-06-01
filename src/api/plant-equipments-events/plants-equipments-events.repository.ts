import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { PlantsEquipmentsEvents } from '@/api/plant-equipments-events/plants-equipments-events.entity';

@Injectable()
export class PlantsEquipmentsEventsRepository extends Repository<PlantsEquipmentsEvents> {
  constructor(private dataSource: DataSource) {
    super(PlantsEquipmentsEvents, dataSource.createEntityManager());
  }
}
