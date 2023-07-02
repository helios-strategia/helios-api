export interface GenerationTariffUpdateRequestDto {
  readonly year?: number;
  readonly quarter?: number;
  readonly costPerKilowattHour?: number;
}
