import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PlantProductivityDeclineRateRequestDto {
  @IsNotEmpty()
  @IsNumberString()
  year: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  coefficient: number;
}
