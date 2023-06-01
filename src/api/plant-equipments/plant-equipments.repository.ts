import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PlantEquipments } from '@/api/plant-equipments/plant-equipments.entity';

@Injectable()
export class PlantEquipmentsRepository extends Repository<PlantEquipments> {
  constructor(private dataSource: DataSource) {
    super(PlantEquipments, dataSource.createEntityManager());
  }
}
