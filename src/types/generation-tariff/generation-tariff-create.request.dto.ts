export interface GenerationTariffCreateRequestDto {
  readonly year: number;
  readonly quarter: number;
  readonly costPerKilowattHour: number;
}
