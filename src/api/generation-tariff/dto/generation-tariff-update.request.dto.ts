import { GenerationTariffUpdateRequestDto as GenerationTariffUpdateRequestDtoType } from '@/types/generation-tariff';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  Max,
  Min,
} from 'class-validator';
import { Quarter } from '@/types/common';
import { enumValidationMessage } from '@/utils';

export class GenerationTariffUpdateRequestDto
  implements GenerationTariffUpdateRequestDtoType
{
  @IsOptional()
  @IsNumber()
  @IsPositive()
  public readonly costPerKilowattHour?: number;

  @IsOptional()
  @IsEnum(Quarter, {
    message: enumValidationMessage('quarter', Quarter),
  })
  public readonly quarter?: Quarter;

  @IsOptional()
  @IsNumber()
  @Min(2000)
  @Max(2099)
  public readonly year?: number;
}
