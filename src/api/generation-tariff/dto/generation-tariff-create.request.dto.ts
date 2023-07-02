import { GenerationTariffCreateRequestDto as GenerationTariffCreateRequestDtoType } from '@/types/generation-tariff';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  Max,
  Min,
} from 'class-validator';
import { Quarter } from '@/types/common';
import { enumValidationMessage } from '@/utils';

export class GenerationTariffCreateRequestDto
  implements GenerationTariffCreateRequestDtoType
{
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  public readonly costPerKilowattHour: number;

  @IsNotEmpty()
  @IsEnum(Quarter, {
    message: enumValidationMessage('quarter', Quarter),
  })
  public readonly quarter: Quarter;

  @IsNotEmpty()
  @IsNumber()
  @Min(2000)
  @Max(2099)
  public readonly year: number;
}
