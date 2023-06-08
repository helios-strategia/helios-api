import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlantStatusHistory } from '@/api/plant-status-history/plant-status-history.entity';
import { PlantStatusHistoryRepository } from '@/api/plant-status-history/plant-status-history.repository';
import { PlantStatusHistoryService } from '@/api/plant-status-history/plant-status-history.service';
import { PlantStatusHistoryProfile } from '@/api/plant-status-history/plant-status-history.profile';

@Module({
  imports: [TypeOrmModule.forFeature([PlantStatusHistory])],
  providers: [
    PlantStatusHistoryRepository,
    PlantStatusHistoryService,
    PlantStatusHistoryProfile,
  ],
  exports: [PlantStatusHistoryService],
})
export class PlantStatusHistoryModule {}
