import { registerAs } from '@nestjs/config';

function buildPostgresUrl(): string {
  const user = encodeURIComponent(process.env.GS_DB_USER ?? '');
  const password = encodeURIComponent(process.env.GS_DB_PASSWORD ?? '');
  const host = process.env.GS_DB_HOST;
  const port = process.env.GS_DB_PORT;
  const database = process.env.GS_DB;

  return `postgresql://${user}:${password}@${host}:${port}/${database}?schema=public`;
}

export default registerAs('database', () => ({
  user: process.env.GS_DB_USER,
  password: process.env.GS_DB_PASSWORD,
  database: process.env.GS_DB,
  host: process.env.GS_DB_HOST,
  port: Number(process.env.GS_DB_PORT),
  url: buildPostgresUrl(),
}));
