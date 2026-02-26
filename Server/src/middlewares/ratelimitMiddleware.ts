import rateLimit from "express-rate-limit";

export const rlimit = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  message: { success: false, message: "Demasiadas solicitudes, intenta más tarde" },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimit = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: { success: false, message: "Demasiados intentos, intenta en 5 minutos" },
  standardHeaders: true,
  legacyHeaders: false,
});

export const resetLimit = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 1,
  message: { success: false, message: "Revisa tu correo electronico para resetear la contraseña" },
  standardHeaders: true,
  legacyHeaders: false,
});
