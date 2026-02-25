import { Redis } from "@upstash/redis";
import { runtimeEnv } from "src/env";

export const redisClient = new Redis({
  url: runtimeEnv.UPSTASH_REDIS_REST_URL,
  token: runtimeEnv.UPSTASH_REDIS_REST_TOKEN,
});


