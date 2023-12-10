import { GenerationTariffUpdateRequestDto as GenerationTariffUpdateRequestDtoType } from '@/types/generation-tariff';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  Max,
  Min,
} from 'class-validator';
import { enumValidationMessage } from '@/utils';
import { QuarterEnum } from '@/consts';
import type { Quarter } from '@/types/generation-tariff/quarter';

export class GenerationTariffUpdateRequestDto
  implements GenerationTariffUpdateRequestDtoType
{
  @IsOptional()
  @IsNumber()
  @IsPositive()
  public readonly costPerKilowattHour?: number;

  @IsOptional()
  @IsEnum(QuarterEnum, {
    message: enumValidationMessage('quarter', QuarterEnum),
  })
  public readonly quarter?: Quarter;

  @IsOptional()
  @IsNumber()
  @Min(2000)
  @Max(2099)
  public readonly year?: number;
}
