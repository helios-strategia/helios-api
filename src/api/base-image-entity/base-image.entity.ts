import { BaseEntity } from "@/api/base-entity/base.entity";
import { AutoMap } from "@automapper/classes";
import { Column } from "typeorm";

export abstract class BaseImageEntity extends BaseEntity {
  @AutoMap()
  @Column({
    name: 'url',
    type: 'varchar',
    nullable: false,
  })
  public readonly url: string;

  @AutoMap()
  @Column({
    name: 'name',
    type: 'text',
    nullable: true,
  })
  public readonly name: string;
}