import { Inject, Injectable, Logger } from '@nestjs/common';
import { PlantStatusHistoryRepository } from '@/api/plant-status-history/plant-status-history.repository';
import { Plant } from '@/api/plant/plant.entity';
import { PlantStatus } from '@/types/plant';

@Injectable()
export class PlantStatusHistoryService {
  @Inject(PlantStatusHistoryRepository)
  private readonly plantStatusHistoryRepository: PlantStatusHistoryRepository;

  public async create(plant: Plant) {
    const plantStatusHistory = await this.plantStatusHistoryRepository.save(
      {
        currentStatus: plant.status,
        plant,
      },
      { transaction: false },
    );

    Logger.log('PlantStatusHistoryService#create', {
      plantStatusHistory,
    });

    return plantStatusHistory;
  }

  public async createOnUpdatedPlant({
    prevStatus,
    currentStatus,
    plant,
  }: {
    prevStatus: PlantStatus;
    currentStatus: PlantStatus;
    plant: Plant;
  }) {
    const plantStatusHistory = await this.plantStatusHistoryRepository.save(
      {
        previousStatus: prevStatus,
        currentStatus,
        plant,
      },
      { transaction: false },
    );

    Logger.log('PlantStatusHistoryService#createOnUpdatedPlant', {
      plantStatusHistory,
    });

    return plantStatusHistory;
  }
}
