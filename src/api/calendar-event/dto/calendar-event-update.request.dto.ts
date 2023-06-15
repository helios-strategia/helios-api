import {
  CalendarEventUpdateRequestDto as CalendarEventUpdateRequestDtoType,
  CalendarEventType
} from "@/types/calendar-event";
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength
} from "class-validator";
import { enumValidationMessage } from "@/utils";
import { ApiProperty } from "@nestjs/swagger";

export class CalendarEventUpdateRequestDto implements CalendarEventUpdateRequestDtoType {
  @IsOptional()
  @IsEnum(CalendarEventType, {
    message: enumValidationMessage('calendarEventType', CalendarEventType)
  })
  readonly calendarEventType?: CalendarEventType;

  @IsOptional()
  @IsString()
  @MaxLength(1024)
  readonly description: string;

  @IsOptional()
  @IsDateString()
  readonly endDate?: Date;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  readonly startDate?: Date;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(254)
  readonly title?: string;
}