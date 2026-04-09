import { defineConfig } from 'drizzle-kit';
import * as fs from 'fs';

// .env.local 수동 로드 (drizzle-kit은 Next.js env 파일을 자동으로 읽지 않음)
const envLocal = fs.existsSync('.env.local')
  ? Object.fromEntries(
      fs.readFileSync('.env.local', 'utf-8')
        .split('\n')
        .filter(Boolean)
        .map(line => line.split('=').map(s => s.trim().replace(/^"|"$/g, '')))
    )
  : {};
Object.assign(process.env, envLocal);

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
