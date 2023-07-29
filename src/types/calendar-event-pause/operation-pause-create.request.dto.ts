export interface OperationPauseCreateRequestDto {
  readonly startAt: Date;
  readonly endAt?: Date;
}
