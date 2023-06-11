import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { PlantEquipmentEventGenerationAffects } from '@/types/plant-equipments-events';
import { enumValidationMessage } from '@/utils';
import { PlantEquipmentsType } from 'src/types/plant-equipments';
import { PlantEquipmentsEventsUpdateRequestDto as PlantEquipmentsEventsUpdateRequestDtoType } from '@/types/plant-equipments-events';
import { ApiProperty } from '@nestjs/swagger';

export class PlantsEquipmentsEventsUpdateRequestDto
  implements PlantEquipmentsEventsUpdateRequestDtoType
{
  @ApiProperty()
  @IsOptional()
  @IsString()
  public readonly location?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  public readonly defectDescription?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  public readonly specificationDescription?: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  public readonly startedAt?: Date;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  public readonly expectationEndAt?: Date;

  @ApiProperty()
  @IsOptional()
  @IsEnum(PlantEquipmentEventGenerationAffects, {
    message: enumValidationMessage(
      'generationAffectsType',
      PlantEquipmentEventGenerationAffects,
    ),
  })
  public readonly generationAffectsType?: PlantEquipmentEventGenerationAffects;

  @ApiProperty()
  @IsOptional()
  @IsEnum(PlantEquipmentsType, {
    message: enumValidationMessage('plantEquipmentType', PlantEquipmentsType),
  })
  public readonly plantEquipmentType?: PlantEquipmentsType;
}
