import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../database/prisma/prisma.service';

export type AuthUserRecord = Prisma.ProjectNovoUsuarioGetPayload<{
  select: {
    id: true;
    nome: true;
    email: true;
    senhaHash: true;
    perfil: true;
    ativo: true;
  };
}>;

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<AuthUserRecord | null> {
    return this.prisma.projectNovoUsuario.findUnique({
      where: { email },
      select: this.authUserSelect(),
    });
  }

  async findById(id: bigint): Promise<AuthUserRecord | null> {
    return this.prisma.projectNovoUsuario.findUnique({
      where: { id },
      select: this.authUserSelect(),
    });
  }

  private authUserSelect() {
    return {
      id: true,
      nome: true,
      email: true,
      senhaHash: true,
      perfil: true,
      ativo: true,
    } as const;
  }
}
