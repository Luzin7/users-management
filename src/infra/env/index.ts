import { config } from 'dotenv';
import { z } from 'zod';
config();

const envSchema = z.object({
  PORT: z.coerce.number().default(7777),
  DATABASE_URL: z.string().url(),
  FRONTEND_PROD_URL: z.string().url(),
  BACKEND_DEV_URL: z.string().url(),
  FRONTEND_DEV_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  JWT_USER_ACCESS_EXPIRES_IN: z.string(),
  JWT_USER_REFRESH_EXPIRES_IN: z.string(),
  USER_REFRESH_EXPIRES_IN: z.coerce.number(),
});

type EnvSchema = z.infer<typeof envSchema>;
const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error('Invalid environment variables', _env.error.format());
  throw new Error('Invalid environment variables');
}
const env: EnvSchema = _env.data;
export { env };
