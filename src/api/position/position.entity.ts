import { Column, Entity, OneToMany } from 'typeorm';
import { Employee } from '../employee/employee.entity';
import { BaseEntity } from '../base-entity/base.entity';

@Entity('positions')
export class Position extends BaseEntity {
  @Column('character varying', { name: 'name', nullable: false, length: 255 })
  public name: string;

  @Column('text', { name: 'description', nullable: true })
  public description: string | null;

  @OneToMany(() => Employee, (employees) => employees.position)
  public employees: Employee[];
}
