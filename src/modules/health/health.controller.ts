import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { NodeEnvironment } from '../../config/env.validation';

interface HealthResponse {
  status: 'ok';
  timestamp: string;
  environment: NodeEnvironment;
}

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  @ApiOkResponse({
    description: 'Verifica se a API esta disponivel.',
    schema: {
      example: {
        status: 'ok',
        timestamp: '2026-04-30T00:00:00.000Z',
        environment: 'development',
      },
    },
  })
  check(): HealthResponse {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: this.configService.get<NodeEnvironment>('app.environment', 'development'),
    };
  }
}
