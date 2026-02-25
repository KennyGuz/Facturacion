import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import { config } from "dotenv";
config();
 
export const runtimeEnv = createEnv({
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  server: {
    DATABASE_URL: z.url(),
	SALT_ROUNDS: z.number(),
	JWT_SECRET: z.string(),
	JWT_RESET_SECRET: z.string(),
	SMPT_HOST: z.string(),
	SMPT_PASS: z.string(),
  },
  runtimeEnvStrict: {
    DATABASE_URL: process.env.DATABASE_URL,
	SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS!),
	JWT_SECRET: process.env.JWT_SECRET,
	JWT_RESET_SECRET: process.env.JWT_RESET_SECRET,
	SMPT_HOST: process.env.SMPT_HOST,
	SMPT_PASS: process.env.SMPT_PASS,
  },
});
