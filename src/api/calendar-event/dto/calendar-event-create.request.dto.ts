import {
  CalendarEventCreateRequestDto as CalendarEventCreateRequestDtoType,
  CalendarEventType,
} from '@/types/calendar-event';
import {
  HasMimeType,
  IsFiles,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';
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
import { enumValidationMessage } from '@/utils';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CalendarEventCreateRequestDto
  implements CalendarEventCreateRequestDtoType
{
  @IsNotEmpty()
  @IsEnum(CalendarEventType, {
    message: enumValidationMessage('calendarEventType', CalendarEventType),
  })
  readonly calendarEventType: CalendarEventType;

  @IsOptional()
  @IsString()
  @MaxLength(1024)
  readonly description: string;

  @IsNotEmpty()
  @IsDateString()
  readonly endDate: Date;

  @ApiProperty()
  @IsOptional()
  @IsFiles()
  @MaxFileSize(10e6, { each: true })
  @HasMimeType(['image/jpeg', 'image/png'], { each: true })
  @ArrayMaxSize(20)
  readonly images?: MemoryStoredFile[];

  @ApiProperty()
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly plantId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  readonly startDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(254)
  readonly title: string;
}
