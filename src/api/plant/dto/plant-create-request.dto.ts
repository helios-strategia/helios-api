import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
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
import { PlantStatus } from '@/api/plant/plant-status.enum';
import { stringifyEnumValues } from '@/utils';
import { IsFiles, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data';
import { PlantProductivityDeclineRateRequestDto } from '@/api/plant/dto/plant-productivity-decline-rate-request.dto';

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
  public readonly locationLatitude: number;

  @ApiProperty()
  @Type(() => Number)
  @IsPositive()
  @IsNumber()
  @Min(-180)
  @Max(180)
  public readonly locationLongitude: number;

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

  @ApiProperty()
  @IsOptional()
  @IsFiles()
  @MaxFileSize(10e6, { each: true })
  public readonly documents: MemoryStoredFile[];

  @ApiProperty({ isArray: true })
  @IsOptional()
  @IsString({ each: true })
  public readonly documentTypes: string[];

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
