import { PlantEquipmentEventGenerationAffects } from '@/types/plant-equipments-events';
import { PlantEquipmentsType } from 'src/types/plant-equipments';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { enumValidationMessage } from '@/utils';

export interface PlantEquipmentsEventsUpdateRequestDto {
  readonly location?: string;
  readonly defectDescription?: string;
  readonly specificationDescription?: string;
  readonly startedAt?: Date;
  readonly expectationEndAt?: Date;
  readonly generationAffectsType?: PlantEquipmentEventGenerationAffects;
  readonly plantEquipmentType?: PlantEquipmentsType;
}
