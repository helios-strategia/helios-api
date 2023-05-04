import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsFiles, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data';
import { PlantStatus } from '@/api/plant/plant-status.enum';
import { CalendarEvent } from '@/api/calendar-event/calendar-event.entity';
import { PlantDocument } from '@/api/plant-document/plant-document.entity';
import { Employee } from '@/api/employee/employee.entity';
import { AutoMap } from '@automapper/classes';
import { stringifyEnumValues } from '@/utils';
import { PlantProductivityDeclineRate } from '@/api/plant/plant-types';
import { PlantStatusHistory } from '@/api/plant-status-history/plant-status-history.entity';

export class PlantProductivityDeclineRateRequestDto {
  @IsNotEmpty()
  @IsDateString()
  year: string;

  @IsNotEmpty()
  @IsPositive()
  coefficient: number;
}

export class PlantCreateRequestDto {
  @ApiProperty()
  @Type(() => Number)
  @IsPositive()
  public readonly acPower: number;

  @ApiProperty()
  @Type(() => Number)
  @IsPositive()
  public readonly dcPower: number;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  @ArrayMinSize(12)
  @ArrayMaxSize(12)
  public readonly pvsystGenerationPlan: number[];

  @ApiProperty()
  @Type(() => Number)
  @IsPositive()
  public readonly area: number;

  @ApiProperty()
  @IsNumberString()
  public readonly ascmePlantCode: string;

  @ApiProperty()
  @IsDateString()
  public readonly exploitationStart: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public readonly name: string;

  @ApiProperty({ enum: PlantStatus })
  @IsString()
  @IsEnum(PlantStatus, {
    message: `status must one of ${stringifyEnumValues(PlantStatus)}`,
  })
  public readonly status: PlantStatus;

  @ApiProperty()
  @Type(() => Number)
  @IsPositive()
  @IsNumber()
  @Min(-90)
  @Max(90)
  public readonly latitude: number;

  @ApiProperty()
  @Type(() => Number)
  @IsPositive()
  @IsNumber()
  @Min(-180)
  @Max(180)
  public readonly longitude: number;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  public readonly employeesId: number[];

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  public readonly userId: number;

  @IsOptional()
  @IsFiles()
  @MaxFileSize(10e6, { each: true })
  public readonly documents: MemoryStoredFile[];

  @IsOptional()
  @IsString({ each: true })
  public readonly documentTypes: string[];

  @IsOptional()
  @ValidateNested({ each: true })
  public readonly plantProductivityDeclineRateRequestDto: PlantProductivityDeclineRateRequestDto[];
}

export class PlantUpdateRequestDto {
  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  public readonly acPower?: number;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  public readonly dcPower?: number;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @ApiProperty()
  @IsNumber({}, { each: true })
  public readonly pvsystGenerationPlan?: number[];

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  public readonly area?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumberString()
  public readonly ascmePlantCode?: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  public readonly exploitationStart?: Date;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly name?: string;

  @ApiProperty({ enum: PlantStatus })
  @IsOptional()
  @IsString()
  @IsEnum(PlantStatus, {
    message: `status must one of ${stringifyEnumValues(PlantStatus)}`,
  })
  public readonly status?: PlantStatus;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @IsNumber()
  @Min(-90)
  @Max(90)
  public readonly latitude?: number;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @IsNumber()
  @Min(-180)
  @Max(180)
  public readonly longitude?: number;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  public readonly employeesId?: number[];

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  public readonly userId: number;
}
