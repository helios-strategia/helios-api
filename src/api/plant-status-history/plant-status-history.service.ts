import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Events } from '@/events/events.enum';
import { PlantCreatedEvent } from '@/events/plant/plant-created.event';
import { PlantStatusHistoryRepository } from '@/api/plant-status-history/plant-status-history.repository';
import { PlantStatusUpdatedEvent } from '@/events/plant/plant-status-updated.event';

@Injectable()
export class PlantStatusHistoryService {
  @Inject(PlantStatusHistoryRepository)
  private readonly plantStatusHistoryRepository: PlantStatusHistoryRepository;

  @OnEvent(Events.PlantCreated)
  private async create(event: PlantCreatedEvent) {
    const plantStatusHistory = await this.plantStatusHistoryRepository.save({
      currentStatus: event.plant.status,
      plant: event.plant,
    });

    Logger.log('PlantStatusHistoryService#create', {
      plantStatusHistory,
    });
  }

  @OnEvent(Events.PlantStatusUpdated)
  private async createOnUpdatedPlant({
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
