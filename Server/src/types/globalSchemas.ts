import { z } from "zod";

export const querySchema = z.object({

 activo: z
    .enum(["true", "false"])
    .optional()
    .transform(val => val === "true"),

  search: z.string().optional(),

  page: z
    .string()
    .optional()
    .default("1")
    .transform(val => Number(val))
    .refine(val => Number.isFinite(val) && val > 0, {
      message: "page debe ser un número mayor a 0",
    }),

  limit: z
    .string()
    .optional()
    .default("10")
    .transform(val => Number(val))
    .refine(val => Number.isFinite(val) && val > 0, {
      message: "limit debe ser un número mayor a 0",
    }),
});

