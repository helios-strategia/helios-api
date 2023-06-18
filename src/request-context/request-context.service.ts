import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { RequestUser } from '@/types/common';

@Injectable({ scope: Scope.REQUEST })
export class RequestContextService {
  private readonly contextMap: Map<string, any> = new Map();

  constructor(@Inject(REQUEST) private readonly request: Request) {}

  public set<T>(key: string, value: T): void {
    this.contextMap.set(key, value);
  }

  public get<T>(key: string): T | undefined {
    return this.contextMap.get(key) as T;
  }

  public get getRequest(): Request {
    return this.request;
  }

  public get getUser(): RequestUser | undefined {
    return this.request.user as RequestUser;
  }

  public get getUserId(): number | undefined {
    return this.getUser?.id;
  }

  public get getRequestId(): string {
    return this.request['request-id'];
  }
}
