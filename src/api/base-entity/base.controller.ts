import { ObjectLiteral } from '@/types/common';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper, ModelIdentifier } from '@automapper/core';

export abstract class BaseController<
  TEntity extends ObjectLiteral,
  TResponseDto extends ObjectLiteral,
> {
  @InjectMapper()
  private readonly classMapper: Mapper;

  protected constructor(
    protected readonly entityConstructor: ModelIdentifier<TEntity>,
    protected readonly responseDtoConstructor: ModelIdentifier<TResponseDto>,
  ) {}

  public toResponseDto(entities: TEntity): TResponseDto;
  public toResponseDto(entities: TEntity[]): TResponseDto[];
  public toResponseDto(
    entities: TEntity | TEntity[],
  ): TResponseDto | TResponseDto[] {
    if (Array.isArray(entities)) {
      return this.classMapper.mapArray(
        entities,
        this.entityConstructor,
        this.responseDtoConstructor,
      );
    }

    return this.classMapper.map(
      entities,
      this.entityConstructor,
      this.responseDtoConstructor,
    );
  }

  public async toResponseDtoAsync(entity: Promise<TEntity>) {
    return this.classMapper.mapAsync(
      await entity,
      this.entityConstructor,
      this.responseDtoConstructor,
    );
  }

  public async toResponseDtoArrayAsync(entities: Promise<TEntity[]>) {
    return this.classMapper.mapArrayAsync(
      await entities,
      this.entityConstructor,
      this.responseDtoConstructor,
    );
  }
}
