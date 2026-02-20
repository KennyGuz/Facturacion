import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import { config } from "dotenv";
config();
 
export const runtimeEnv = createEnv({
  server: {
    DATABASE_URL: z.url(),
  },
  runtimeEnvStrict: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
});
