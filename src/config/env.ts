import { config } from 'dotenv';
import { z } from 'zod';

config();

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  PORT: z.string().transform(Number).default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  ADMIN_EMAIL: z.string().email(),
  ADMIN_MOBILE: z.string().regex(/^\d{10}$/),
  ADMIN_PASSWORD: z.string().min(6),
});

const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment variables:');
      error.issues.forEach((err) => {
        console.error(`  ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
};

export const env = parseEnv();