import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: '1' })
  id: string;

  @ApiProperty({ example: 'Julia Test' })
  nome: string;

  @ApiProperty({ example: 'julia@test.com' })
  email: string;

  @ApiProperty({ example: 'Admin' })
  perfil: string;

  @ApiProperty({ example: true })
  ativo: boolean;

  @ApiProperty({ example: '2026-04-30T00:00:00.000Z' })
  criadoEm: string;

  @ApiProperty({ example: '2026-04-30T00:00:00.000Z' })
  atualizadoEm: string;
}
