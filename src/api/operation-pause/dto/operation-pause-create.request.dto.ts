import { OperationPauseCreateRequestDto as CalendarEventPauseCreateRequestDtoType } from '@/types';
import { IsDate, IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class OperationPauseCreateRequestDto
  implements CalendarEventPauseCreateRequestDtoType
{
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  public readonly startAt: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  public readonly endAt?: Date;
}
