import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Events } from '@/events/events.enum';
import { PlantStatusHistoryRepository } from '@/api/plant-status-history/plant-status-history.repository';
import { PlantStatusUpdatedEvent } from '@/events/plant/plant-status-updated.event';
import { Plant } from '@/api/plant/plant.entity';

@Injectable()
export class PlantStatusHistoryService {
  @Inject(PlantStatusHistoryRepository)
  private readonly plantStatusHistoryRepository: PlantStatusHistoryRepository;

  public async create(plant: Plant) {
    const plantStatusHistory = await this.plantStatusHistoryRepository.save({
      currentStatus: plant.status,
      plant,
    });

    Logger.log('PlantStatusHistoryService#create', {
      plantStatusHistory,
    });

    return plantStatusHistory;
  }

  public async createOnUpdatedPlant({
    prevStatus,
    currentStatus,
    plant,
  }: PlantStatusUpdatedEvent) {
    const plantStatusHistory = await this.plantStatusHistoryRepository.save({
      previousStatus: prevStatus,
      currentStatus,
      plant,
    });

    Logger.log('PlantStatusHistoryService#createOnUpdatedPlant', {
      plantStatusHistory,
    });
  }
}
