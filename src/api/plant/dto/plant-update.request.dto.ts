import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PlantStatus } from '@/types/plant/plant-status.enum';
import { stringifyEnumValues } from '@/utils';
import { PlantProductivityDeclineRateRequestDto } from '@/api/plant/dto/plant-productivity-decline-rate.request.dto';

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
  public readonly locationLatitude?: number;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @IsNumber()
  @Min(-180)
  @Max(180)
  public readonly locationLongitude?: number;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  public readonly employeesId?: number[];

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  public readonly userId: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PlantProductivityDeclineRateRequestDto)
  public readonly plantProductivityDeclineRate: PlantProductivityDeclineRateRequestDto[];

  @IsOptional()
  @IsString()
  @MaxLength(50)
  public readonly contactPersonName: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  public readonly contactPersonPhone: string;

  @IsOptional()
  @IsEmail()
  public readonly contactPersonEmail: string;
}
