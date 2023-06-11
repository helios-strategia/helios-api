import { PlantEquipmentEventGenerationAffects } from '@/types/plant-equipments-events';
import { PlantEquipmentsType } from 'src/types/plant-equipments';
import { BaseEntity } from '@/types/base-entity';
import { PlantEquipmentsEventsImages } from '@/api/plant-equipments-events-images/plant-equipments-events-images.entity';
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
}
