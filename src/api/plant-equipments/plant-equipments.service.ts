import { Inject, Injectable, Logger } from '@nestjs/common';
import { PlantEquipmentsRepository } from '@/api/plant-equipments/plant-equipments.repository';
import { PlantEquipmentsType } from '@/types/plant-equipments';
import { Plant } from '@/api/plant/plant.entity';

@Injectable()
export class PlantEquipmentsService {
  @Inject(PlantEquipmentsRepository)
  private readonly plantEquipmentsRepository: PlantEquipmentsRepository;

  public async createForPlant(plant: Plant) {
    return Promise.all(
      Object.values(PlantEquipmentsType).map((equipmentType) => {
        return this.plantEquipmentsRepository.save(
          {
            equipmentType,
            plant,
          },
          { transaction: false },
        );
      }),
    );
  }

  public async bulkDelete(plantId: number) {
    const deleteResult = await this.plantEquipmentsRepository.delete({
      plant: { id: plantId },
    });

    Logger.log('PlantEquipmentsService#delete', {
      deleteResult,
    });
  }

  public async getByPlantAndType(plantId: number, type: PlantEquipmentsType) {
    return this.plantEquipmentsRepository.findOne({
      where: { plant: { id: plantId }, equipmentType: type },
    });
  }

  public async getByPlant(plantId: number) {
    return this.plantEquipmentsRepository.find({
      where: { plant: { id: plantId } },
      relations: {
        plantsEquipmentsEvents: { plantEquipmentsEventsImages: true },
      },
    });
  }
}
