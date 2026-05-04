import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CurrentUser } from '../../common/types/current-user.type';
import { JwtPayload } from '../../common/types/jwt-payload.type';
import { comparePassword } from '../../common/utils/password-hash.util';
import { AuthRepository, AuthUserRecord } from './auth.repository';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.authRepository.findByEmail(loginDto.email);

    if (!user || !user.ativo) {
      throw new UnauthorizedException('Email ou senha invalidos');
    }

    const passwordMatches = await comparePassword(loginDto.senha, user.senhaHash);
    if (!passwordMatches) {
      throw new UnauthorizedException('Email ou senha invalidos');
    }

    const currentUser = this.toCurrentUser(user);
    const accessToken = await this.signToken({
      sub: currentUser.id,
      email: currentUser.email,
      nome: currentUser.nome,
      perfil: currentUser.perfil,
    });

    return {
      accessToken,
      user: currentUser,
    };
  }

  async signToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  toCurrentUser(user: AuthUserRecord): CurrentUser {
    return {
      id: user.id.toString(),
      nome: user.nome,
      email: user.email,
      perfil: user.perfil,
    };
  }
}
