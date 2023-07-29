import {
  OperationCreateRequestDto as OperationCreateRequestDtoType,
  OperationType,
} from '@/types/operation';
import {
  HasMimeType,
  IsFiles,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';
import {
  ArrayMaxSize,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { enumValidationMessage } from '@/utils';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { OperationTypeEnum } from '@/consts';

export class OperationCreateRequestDto
  implements OperationCreateRequestDtoType
{
  @IsNotEmpty()
  @IsEnum(OperationTypeEnum, {
    message: enumValidationMessage('operationType', OperationTypeEnum),
  })
  public readonly operationType: OperationType;

  @IsOptional()
  @IsString()
  @MaxLength(1024)
  public readonly description?: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  public readonly endDate: Date;

  @ApiProperty()
  @IsOptional()
  @IsFiles()
  @MaxFileSize(10e6, { each: true })
  @HasMimeType(['image/jpeg', 'image/png'], { each: true })
  @ArrayMaxSize(20)
  public readonly images?: MemoryStoredFile[];

  @ApiProperty()
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  public readonly plantId: number;

  @ApiProperty()
  @Type(() => Date)
  @IsNotEmpty()
  @IsDate()
  public readonly startDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(254)
  public readonly title: string;
}
