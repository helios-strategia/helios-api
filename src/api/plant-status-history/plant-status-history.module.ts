import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlantStatusHistory } from '@/api/plant-status-history/plant-status-history.entity';
import { PlantStatusHistoryRepository } from '@/api/plant-status-history/plant-status-history.repository';
import { PlantStatusHistoryService } from '@/api/plant-status-history/plant-status-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlantStatusHistory])],
  providers: [PlantStatusHistoryRepository, PlantStatusHistoryService],
  exports: [PlantStatusHistoryService],
})
export class PlantStatusHistoryModule {}
