import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import appConfig from '../src/config/app.config';
import databaseConfig from '../src/config/database.config';
import { validateEnv } from '../src/config/env.validation';
import jwtConfig from '../src/config/jwt.config';
import { HealthModule } from '../src/modules/health/health.module';

describe('HealthController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.PORT = '3000';
    process.env.NODE_ENV = 'test';
    process.env.GS_DB_USER = 'postgres';
    process.env.GS_DB_PASSWORD = 'postgres';
    process.env.GS_DB = 'app_db';
    process.env.GS_DB_HOST = 'localhost';
    process.env.GS_DB_PORT = '5432';
    process.env.JWT_KEY = 'test_secret';
    process.env.JWT_EXPIRES_IN = '1d';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [appConfig, databaseConfig, jwtConfig],
          validate: validateEnv,
        }),
        HealthModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/health (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/api/health').expect(200);

    expect(response.body).toEqual({
      status: 'ok',
      timestamp: expect.any(String),
      environment: app.get(ConfigService).get('app.environment'),
    });
  });
});
