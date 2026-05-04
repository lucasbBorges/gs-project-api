import { registerAs } from '@nestjs/config';

import { NodeEnvironment } from './env.validation';

export default registerAs('app', () => ({
  port: Number(process.env.PORT ?? 3000),
  environment: (process.env.NODE_ENV ?? 'development') as NodeEnvironment,
}));
