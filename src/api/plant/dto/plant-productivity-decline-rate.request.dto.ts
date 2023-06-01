import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PlantProductivityDeclineRateRequestDto as PlantProductivityDeclineRateRequestDtoType } from '@/types/plant';

export class PlantProductivityDeclineRateRequestDto
  implements PlantProductivityDeclineRateRequestDtoType
{
  @IsNotEmpty()
  @IsNumberString()
  public readonly year: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  public readonly coefficient: number;
}
