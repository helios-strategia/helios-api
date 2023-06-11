import {
  ArrayMaxSize,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import {
  HasMimeType,
  IsFiles,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';
import {
  PlantEquipmentEventGenerationAffects,
  PlantEquipmentsEventsCreateRequestDto as PlantEquipmentsEventsCreateRequestDtoType,
} from '@/types/plant-equipments-events';
import { enumValidationMessage } from '@/utils';
import { PlantEquipmentsType } from 'src/types/plant-equipments';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PlantsEquipmentsEventsCreateRequestDto
  implements PlantEquipmentsEventsCreateRequestDtoType
{
  @ApiProperty()
  @IsOptional()
  @IsString()
  public readonly location?: string;

  @ApiProperty()
  @IsOptional()
  @IsFiles()
  @HasMimeType(['image/jpeg', 'image/png'], { each: true })
  @MaxFileSize(15e6, { each: true })
  @ArrayMaxSize(15)
  public readonly images?: MemoryStoredFile[];

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(1024)
  public readonly defectDescription: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(1024)
  public readonly specificationDescription: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  public readonly startedAt: Date;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  public readonly expectationEndAt?: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(PlantEquipmentEventGenerationAffects, {
    message: enumValidationMessage(
      'generationAffectsType',
      PlantEquipmentEventGenerationAffects,
    ),
  })
  public readonly generationAffectsType: PlantEquipmentEventGenerationAffects;

  @ApiProperty()
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  public readonly plantId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(PlantEquipmentsType, {
    message: enumValidationMessage('plantEquipmentType', PlantEquipmentsType),
  })
  public readonly plantEquipmentType: PlantEquipmentsType;
}
