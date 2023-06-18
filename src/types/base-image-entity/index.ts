import { BaseEntity } from '@/types/base-entity';

export interface BaseImageEntity extends BaseEntity {
  readonly url: string;
  readonly name: string;
}
