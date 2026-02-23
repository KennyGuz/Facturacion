import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import { config } from "dotenv";
config();
 
export const runtimeEnv = createEnv({
  server: {
    DATABASE_URL: z.url(),
	SALT_ROUNDS: z.number(),
	JWT_SECRET: z.string()
  },
  runtimeEnvStrict: {
    DATABASE_URL: process.env.DATABASE_URL,
	SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS!),
	JWT_SECRET: process.env.JWT_SECRET
  },
});
