import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { CurrentUser } from '../../../common/types/current-user.type';
import { JwtPayload } from '../../../common/types/jwt-payload.type';
import { AuthRepository } from '../auth.repository';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private readonly authRepository: AuthRepository,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('jwt.secret'),
    });
  }

  async validate(payload: JwtPayload): Promise<CurrentUser> {
    const userId = this.parseUserId(payload.sub);
    const user = await this.authRepository.findById(userId);

    if (!user || !user.ativo) {
      throw new UnauthorizedException('Usuario invalido ou inativo');
    }

    return this.authService.toCurrentUser(user);
  }

  private parseUserId(subject: string): bigint {
    try {
      return BigInt(subject);
    } catch {
      throw new UnauthorizedException('Token invalido');
    }
  }
}
