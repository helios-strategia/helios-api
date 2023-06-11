import { BaseEntity } from '@/types/base-entity';
import { PlantEquipmentsType } from '@/types/plant-equipments/plant-equipments-type.enum';
import { PlantEquipmentsEventsResponseDto } from '@/types/plant-equipments-events';
import { PlantResponseDto } from '@/types/plant';

export interface PlantEquipmentsResponseDto extends BaseEntity {
  readonly equipmentType: PlantEquipmentsType;
  readonly plantsEquipmentsEvents: PlantEquipmentsEventsResponseDto[];
  readonly plant: PlantResponseDto;
}
