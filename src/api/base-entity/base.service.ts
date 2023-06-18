import { ObjectLiteral } from '@/types/common';

export abstract class BaseService<
  TEntity extends ObjectLiteral,
  TResponseDto extends ObjectLiteral,
> {
  protected get entity() {
    return null;
  }
}
