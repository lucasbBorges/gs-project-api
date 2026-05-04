import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { USER_PROFILES, UserProfile } from '../../../common/constants/user-profiles.constants';

export class CreateUserDto {
  @ApiProperty({ example: 'Julia Test', maxLength: 150 })
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  nome: string;

  @ApiProperty({ example: 'julia@test.com', maxLength: 255 })
  @IsEmail()
  @MaxLength(255)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  email: string;

  @ApiProperty({ example: '123', minLength: 1 })
  @IsString()
  @MinLength(1)
  senha: string;

  @ApiProperty({ example: 'Admin', enum: USER_PROFILES })
  @IsIn(USER_PROFILES)
  perfil: UserProfile;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
