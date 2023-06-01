export class DBConflictError extends Error {
  public constructor(message: string) {
    super(message);
  }
}
