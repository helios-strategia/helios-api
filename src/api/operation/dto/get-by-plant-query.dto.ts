import { IsDateString, IsOptional } from 'class-validator';
import { DateString } from '@/types';

export class GetByPlantQueryDto {
  @IsOptional()
  @IsDateString()
  public readonly startDate: DateString;

  @IsOptional()
  @IsDateString()
  public readonly endDate: DateString;
}
