export class NoDataFoundError<T extends Function = any> extends Error {
  constructor(public readonly entity: T, public readonly id?: number) {
    super(`${entity.name} not found`);
  }
}
