import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { hashPassword } from '../../common/utils/password-hash.util';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserRecord, UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    try {
      const user = await this.usersRepository.create({
        nome: createUserDto.nome,
        email: createUserDto.email,
        senhaHash: await hashPassword(createUserDto.senha),
        perfil: createUserDto.perfil,
        ativo: createUserDto.ativo ?? true,
      });

      return this.toResponse(user);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersRepository.findAll();
    return users.map((user) => this.toResponse(user));
  }

  async findById(id: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findById(this.parseId(id));

    if (!user) {
      throw new NotFoundException('Usuario nao encontrado');
    }

    return this.toResponse(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const userId = this.parseId(id);
    const data: Prisma.ProjectNovoUsuarioUpdateInput = {
      nome: updateUserDto.nome,
      email: updateUserDto.email,
      perfil: updateUserDto.perfil,
      ativo: updateUserDto.ativo,
    };

    if (updateUserDto.senha) {
      data.senhaHash = await hashPassword(updateUserDto.senha);
    }

    try {
      const user = await this.usersRepository.update(userId, data);
      return this.toResponse(user);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async remove(id: string): Promise<UserResponseDto> {
    try {
      const user = await this.usersRepository.softDelete(this.parseId(id));
      return this.toResponse(user);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private parseId(id: string): bigint {
    try {
      return BigInt(id);
    } catch {
      throw new NotFoundException('Usuario nao encontrado');
    }
  }

  private toResponse(user: UserRecord): UserResponseDto {
    return {
      id: user.id.toString(),
      nome: user.nome,
      email: user.email,
      perfil: user.perfil,
      ativo: user.ativo,
      criadoEm: user.criadoEm.toISOString(),
      atualizadoEm: user.atualizadoEm.toISOString(),
    };
  }

  private handlePrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new ConflictException('Email ja cadastrado');
      }

      if (error.code === 'P2025') {
        throw new NotFoundException('Usuario nao encontrado');
      }
    }

    throw error;
  }
}
