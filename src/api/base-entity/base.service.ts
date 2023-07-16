import { InjectMapper } from '@automapper/nestjs';
import { Mapper, ModelIdentifier } from '@automapper/core';

import { ObjectLiteral } from '@/types/common';
import { Inject } from '@nestjs/common';
import { RequestContextService } from '@/request-context/request-context.service';

export abstract class BaseService<
  TEntity extends ObjectLiteral,
  TResponseDto extends ObjectLiteral,
> {
  protected readonly className: string;

  @InjectMapper()
  private readonly classMapper: Mapper;

  @Inject(RequestContextService)
  protected readonly requestContextService: RequestContextService;

  protected constructor(
    protected readonly entityConstructor: ModelIdentifier<TEntity>,
    protected readonly responseDtoConstructor: ModelIdentifier<TResponseDto>,
  ) {
    this.className = this.constructor.name;
  }

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

  protected getDeleteApiResponse(id: number) {
    return {
      message: `${this.entityConstructor['name']} [${id}] successfully removed`,
    };
  }

  protected get getLogMeta() {
    return {
      request_id: this.requestContextService.getRequestId,
      user_id: this.requestContextService.getUserId,
    };
  }
}
