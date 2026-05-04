import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../database/prisma/prisma.service';

export type UserRecord = Prisma.ProjectNovoUsuarioGetPayload<{
  select: ReturnType<UsersRepository['userSelect']>;
}>;

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ProjectNovoUsuarioCreateInput): Promise<UserRecord> {
    return this.prisma.projectNovoUsuario.create({
      data,
      select: this.userSelect(),
    });
  }

  async findAll(): Promise<UserRecord[]> {
    return this.prisma.projectNovoUsuario.findMany({
      orderBy: { nome: 'asc' },
      select: this.userSelect(),
    });
  }

  async findById(id: bigint): Promise<UserRecord | null> {
    return this.prisma.projectNovoUsuario.findUnique({
      where: { id },
      select: this.userSelect(),
    });
  }

  async update(id: bigint, data: Prisma.ProjectNovoUsuarioUpdateInput): Promise<UserRecord> {
    return this.prisma.projectNovoUsuario.update({
      where: { id },
      data,
      select: this.userSelect(),
    });
  }

  async softDelete(id: bigint): Promise<UserRecord> {
    return this.prisma.projectNovoUsuario.update({
      where: { id },
      data: { ativo: false },
      select: this.userSelect(),
    });
  }

  userSelect() {
    return {
      id: true,
      nome: true,
      email: true,
      perfil: true,
      ativo: true,
      criadoEm: true,
      atualizadoEm: true,
    } as const;
  }
}
