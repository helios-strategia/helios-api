export abstract class BaseApiService<
  TEntity extends Object,
  TResponseDto extends Object,
> {
  protected get entity() {
    return null;
  }
}
