import {
  ArrayMaxSize,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNotIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { IsFiles, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data';
import {
  PlantEquipmentEventGenerationAffects,
  PlantEquipmentsEventsCreateRequestDto as PlantEquipmentsEventsCreateRequestDtoType,
} from '@/types/plant-equipments-events';
import { enumValidationMessage } from '@/utils';
import { PlantEquipmentsType } from 'src/types/plant-equipments';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PlantsEquipmentsEventsUpdateRequestDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  public readonly location?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  public readonly description?: string;

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
