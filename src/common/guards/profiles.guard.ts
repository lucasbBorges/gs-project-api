import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PROFILES_KEY } from '../decorators/profiles.decorator';
import { AuthenticatedRequest } from '../types/authenticated-request.type';
import { UserProfile } from '../constants/user-profiles.constants';

@Injectable()
export class ProfilesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredProfiles = this.reflector.getAllAndOverride<UserProfile[]>(PROFILES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredProfiles || requiredProfiles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const userProfile = request.user?.perfil;

    if (!userProfile || !requiredProfiles.includes(userProfile as UserProfile)) {
      throw new ForbiddenException('Usuario sem permissao para acessar este recurso');
    }

    return true;
  }
}
