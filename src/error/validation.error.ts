export class ValidationError extends Error {
  public readonly data: Record<string, any>;
  constructor(message: string, data?: Record<string, any>) {
    super(message);
    this.data = data;
  }
}
