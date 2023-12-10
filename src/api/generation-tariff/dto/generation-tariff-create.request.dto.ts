import { GenerationTariffCreateRequestDto as GenerationTariffCreateRequestDtoType } from '@/types/generation-tariff';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  Max,
  Min,
} from 'class-validator';
import { enumValidationMessage } from '@/utils';
import { QuarterEnum } from '@/consts';

export class GenerationTariffCreateRequestDto
  implements GenerationTariffCreateRequestDtoType
{
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  public readonly costPerKilowattHour: number;

  @IsNotEmpty()
  @IsEnum(QuarterEnum, {
    message: enumValidationMessage('quarter', QuarterEnum),
  })
  public readonly quarter: QuarterEnum;

  @IsNotEmpty()
  @IsNumber()
  @Min(2000)
  @Max(2099)
  public readonly year: number;
}
