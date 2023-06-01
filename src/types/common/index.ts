import { HttpStatus } from '@nestjs/common';
import { UserRole } from '@/types/user';

export type HttpErrorMessage = {
  message: string;
  statusCode: HttpStatus;
  timestamp: string;
  data?: Record<string, any>;
};

export type DeleteApiResponse = {
  message: string;
};

export interface RequestUser {
  id: number;
  email: string;
  role: UserRole;
}
