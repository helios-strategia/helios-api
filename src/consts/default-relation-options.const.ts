import { RelationOptions } from 'typeorm/decorator/options/RelationOptions';

export const defaultRelationOptions: RelationOptions = {
  onDelete: 'NO ACTION',
  onUpdate: 'NO ACTION',
  createForeignKeyConstraints: false,
};
