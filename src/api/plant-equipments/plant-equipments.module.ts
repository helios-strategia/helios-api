import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlantEquipments } from '@/api/plant-equipments/plant-equipments.entity';
import { PlantEquipmentsRepository } from '@/api/plant-equipments/plant-equipments.repository';
import { PlantEquipmentsService } from '@/api/plant-equipments/plant-equipments.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlantEquipments])],
  providers: [PlantEquipmentsRepository, PlantEquipmentsService],
  exports: [PlantEquipmentsService],
})
export class PlantEquipmentsModule {}
