import { RequestUser } from '@/types/common';

export class RoleBasedStrategy {
  private readonly user: RequestUser;
  private constructor(user: RequestUser) {}

  public static of(user: RequestUser) {}

  public onAdminAction() {}

  public onClientAction() {}

  public throwExeption() {}
}
