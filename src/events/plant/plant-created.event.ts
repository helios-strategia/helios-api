import { Plant } from '@/api/plant/plant.entity';

type PlantCreatedEventOptions = {
  plant: Plant;
};

export class PlantCreatedEvent {
  public readonly plant: Plant;
  constructor({ plant }: PlantCreatedEventOptions) {
    this.plant = plant;
  }
}
