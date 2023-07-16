import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Employee } from '../employee/employee.entity';
import { BaseEntity } from '../base-entity/base.entity';
import { AutoMap } from '@automapper/classes';

@Index(['name'], { unique: true })
@Entity('positions')
export class Position extends BaseEntity {
  @AutoMap()
  @Column('character varying', { name: 'name', nullable: false, length: 255 })
  public name: string;

  @AutoMap()
  @Column('text', { name: 'description', nullable: true })
  public description: string | null;

  @OneToMany(() => Employee, (employees) => employees.position)
  public employees: Employee[];
}
