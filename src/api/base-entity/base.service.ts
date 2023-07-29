import { InjectMapper } from '@automapper/nestjs';
import { Mapper, ModelIdentifier } from '@automapper/core';

import { ObjectLiteral } from '@/types/common';
import { Inject, Logger } from '@nestjs/common';
import { RequestContextService } from '@/request-context/request-context.service';

export abstract class BaseService<TEntity extends ObjectLiteral> {
  protected readonly className: string;

  @InjectMapper()
  private readonly classMapper: Mapper;

  @Inject(RequestContextService)
  protected readonly requestContextService: RequestContextService;

  protected constructor(
    protected readonly entityConstructor: ModelIdentifier<TEntity>,
  ) {
    this.className = this.constructor.name;
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

  protected get logger() {
    return {
      log: (message: any, ...optionalParams: [...any, string?]) =>
        Logger.log({ ...this.getLogMeta, ...message }, ...optionalParams),
      error: (message: any, ...optionalParams: [...any, string?]) =>
        Logger.error({ ...this.getLogMeta, ...message }, ...optionalParams),
    };
  }
}
