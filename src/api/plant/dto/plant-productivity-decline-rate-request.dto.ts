import { IsNotEmpty, IsNumberString, IsPositive } from 'class-validator';

export class PlantProductivityDeclineRateRequestDto {
  @IsNotEmpty()
  @IsNumberString()
  year: string;

  @IsNotEmpty()
  @IsPositive()
  coefficient: number;
}
