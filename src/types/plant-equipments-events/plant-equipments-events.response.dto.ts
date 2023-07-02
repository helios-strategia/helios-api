import { PlantEquipmentEventGenerationAffects } from '@/types/plant-equipments-events';
import {
  PlantEquipmentsResponseDto,
  PlantEquipmentsType,
} from '@/types/plant-equipments';
import { BaseEntity } from '@/types/base-entity';
import { PlantEquipmentsEventsImagesResponseDto } from '@/types/plant-equipments-events-images';

export interface PlantEquipmentsEventsResponseDto extends BaseEntity {
  readonly location: string | null;
  readonly expectationEndAt?: Date | null;
  readonly defectDescription: string;
  readonly specificationDescription: string;
  readonly startedAt: Date;
  readonly generationAffectsType: PlantEquipmentEventGenerationAffects;
  readonly plantId: number;
  readonly plantEquipmentType: PlantEquipmentsType;
  readonly plantEquipmentsEventsImages: PlantEquipmentsEventsImagesResponseDto[];
  readonly plantEquipment: PlantEquipmentsResponseDto;
}
