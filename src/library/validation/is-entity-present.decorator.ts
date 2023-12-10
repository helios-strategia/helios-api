import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { isNil } from 'lodash';

@ValidatorConstraint({ async: true })
export class IsEntityPresentConstraint implements ValidatorConstraintInterface {
  @InjectDataSource()
  private readonly dataSource: DataSource;
  public async validate(entityId: any, args: ValidationArguments) {
    const [Entity] = args.constraints;
    const repository = this.dataSource.getRepository(Entity);
    const entity = await repository.find({ where: { id: entityId } });

    return !isNil(entity);
  }

  defaultMessage(args?: ValidationArguments) {
    return `Entity [${args.constraints.at(0)?.['name']}] with id [${
      args.value
    }] doesn't exists`;
  }
}

export const IsEntityPresent =
  <T extends Object>(Entity: T, validationOptions?: ValidationOptions) =>
  (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [Entity],
      validator: IsEntityPresentConstraint,
    });
  };
