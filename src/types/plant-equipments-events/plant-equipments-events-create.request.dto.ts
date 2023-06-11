import { MemoryStoredFile } from 'nestjs-form-data';
import { PlantEquipmentEventGenerationAffects } from '@/types/plant-equipments-events';
import { PlantEquipmentsType } from 'src/types/plant-equipments';

export interface PlantEquipmentsEventsCreateRequestDto {
  readonly location?: string;
  readonly images?: MemoryStoredFile[];
  readonly expectationEndAt?: Date;
  readonly defectDescription: string;
  readonly specificationDescription: string;
  readonly startedAt: Date;
  readonly generationAffectsType: PlantEquipmentEventGenerationAffects;
  readonly plantId: number;
  readonly plantEquipmentType: PlantEquipmentsType;
}
