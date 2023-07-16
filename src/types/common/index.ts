import { HttpStatus } from '@nestjs/common';
import { UserRole } from '@/types/user';

export type ApiErrorResponse = {
  message: string;
  statusCode: HttpStatus;
  timestamp: string;
  data?: Record<string, any>;
};

export type ApiDeleteResponse = {
  message: string;
};

export interface RequestUser {
  readonly id: number;
  readonly email: string;
  readonly role: UserRole;
}

export interface ObjectLiteral {
  [key: string]: any;
}

export enum Quarter {
  First = 1,
  Second = 2,
  Third = 3,
  Four = 4,
}

type InputSignleEitherArray<T> = T | T[];

type OutputSignleEitherArray<T> = T extends T[] ? T[] : T;
