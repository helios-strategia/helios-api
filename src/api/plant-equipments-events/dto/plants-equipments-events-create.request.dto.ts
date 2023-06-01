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
import { IsFiles, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data';
import {
  PlantEquipmentEventGenerationAffects,
  PlantEquipmentsEventsCreateRequestDto as PlantEquipmentsEventsCreateRequestDtoType,
} from '@/types/plant-equipments-events';
import { enumValidationMessage } from '@/utils';
import { IsEntityPresent } from '@/validation/is-entity-present.decorator';
import { Plant } from '@/api/plant/plant.entity';
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
  @MaxFileSize(10e6, { each: true })
  @ArrayMaxSize(15)
  public readonly images?: MemoryStoredFile[];

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  public readonly description: string;

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
  //@IsEntityPresent(Plant)
  public readonly plantId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(PlantEquipmentsType, {
    message: enumValidationMessage('plantEquipmentType', PlantEquipmentsType),
  })
  public readonly plantEquipmentType: PlantEquipmentsType;
}
