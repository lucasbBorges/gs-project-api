export type NodeEnvironment = 'development' | 'test' | 'production';

export interface EnvironmentVariables {
  GS_DB_USER: string;
  GS_DB_PASSWORD: string;
  GS_DB: string;
  GS_DB_HOST: string;
  GS_DB_PORT: number;
  JWT_KEY: string;
  JWT_EXPIRES_IN: string;
  PORT: number;
  NODE_ENV: NodeEnvironment;
}

const allowedNodeEnvs: NodeEnvironment[] = ['development', 'test', 'production'];

export function validateEnv(config: Record<string, unknown>): EnvironmentVariables {
  const requiredKeys = [
    'GS_DB_USER',
    'GS_DB_PASSWORD',
    'GS_DB',
    'GS_DB_HOST',
    'GS_DB_PORT',
    'JWT_KEY',
  ];
  const missingKeys = requiredKeys.filter((key) => !config[key]);

  if (missingKeys.length > 0) {
    throw new Error(`Missing required environment variables: ${missingKeys.join(', ')}`);
  }

  const port = Number(config.PORT ?? 3000);
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error('PORT must be a positive integer');
  }

  const databasePort = Number(config.GS_DB_PORT);
  if (!Number.isInteger(databasePort) || databasePort <= 0) {
    throw new Error('GS_DB_PORT must be a positive integer');
  }

  const nodeEnv = String(config.NODE_ENV ?? 'development');
  if (!allowedNodeEnvs.includes(nodeEnv as NodeEnvironment)) {
    throw new Error(`NODE_ENV must be one of: ${allowedNodeEnvs.join(', ')}`);
  }

  return {
    GS_DB_USER: String(config.GS_DB_USER),
    GS_DB_PASSWORD: String(config.GS_DB_PASSWORD),
    GS_DB: String(config.GS_DB),
    GS_DB_HOST: String(config.GS_DB_HOST),
    GS_DB_PORT: databasePort,
    JWT_KEY: String(config.JWT_KEY),
    JWT_EXPIRES_IN: String(config.JWT_EXPIRES_IN ?? '1d'),
    PORT: port,
    NODE_ENV: nodeEnv as NodeEnvironment,
  };
}