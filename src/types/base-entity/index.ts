import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';

export interface BaseEntity extends ObjectLiteral {
  readonly id: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
