const { spawnSync } = require('node:child_process');
const { existsSync, readFileSync } = require('node:fs');
const { join } = require('node:path');

function loadDotEnv() {
  const envPath = join(process.cwd(), '.env');
  if (!existsSync(envPath)) {
    return;
  }

  const lines = readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    process.env[key] = process.env[key] ?? value;
  }
}

function buildDatabaseUrl() {
  const requiredKeys = ['GS_DB_USER', 'GS_DB_PASSWORD', 'GS_DB', 'GS_DB_HOST', 'GS_DB_PORT'];
  const missingKeys = requiredKeys.filter((key) => !process.env[key]);

  if (missingKeys.length > 0) {
    throw new Error(`Missing required database variables: ${missingKeys.join(', ')}`);
  }

  const user = encodeURIComponent(process.env.GS_DB_USER);
  const password = encodeURIComponent(process.env.GS_DB_PASSWORD);
  const host = process.env.GS_DB_HOST;
  const port = process.env.GS_DB_PORT;
  const database = process.env.GS_DB;

  return `postgresql://${user}:${password}@${host}:${port}/${database}?schema=public`;
}

loadDotEnv();

const command = process.platform === 'win32'
  ? join(process.cwd(), 'node_modules', '.bin', 'prisma.cmd')
  : join(process.cwd(), 'node_modules', '.bin', 'prisma');
const result = spawnSync(command, process.argv.slice(2), {
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: {
    ...process.env,
    DATABASE_URL: process.env.DATABASE_URL ?? buildDatabaseUrl(),
  },
});

if (result.error) {
  console.error(result.error.message);
}

process.exit(result.status ?? 1);
