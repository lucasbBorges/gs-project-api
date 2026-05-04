import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { AuthenticatedRequest } from '../types/authenticated-request.type';
import { CurrentUser } from '../types/current-user.type';

export const GetCurrentUser = createParamDecorator(
  (data: keyof CurrentUser | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
