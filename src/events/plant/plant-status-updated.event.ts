import { PlantStatus } from '@/api/plant/plant-status.enum';
import { Plant } from '@/api/plant/plant.entity';

type PlantStatusEventUpdatedEventOptions = {
  prevStatus: PlantStatus;
  currentStatus: PlantStatus;
  plant: Plant;
};

export class PlantStatusUpdatedEvent {
  public readonly prevStatus: PlantStatus;
  public readonly currentStatus: PlantStatus;
  public readonly plant: Plant;

  constructor({
    prevStatus,
    currentStatus,
    plant,
  }: PlantStatusEventUpdatedEventOptions) {
    this.currentStatus = currentStatus;
    this.prevStatus = prevStatus;
    this.plant = plant;
  }
}
