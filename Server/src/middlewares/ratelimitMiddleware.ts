import rateLimit from "express-rate-limit";

export const rlimit = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 250,
  message: { success: false, message: "demasiados intentos", error: "Demasiadas solicitudes, intenta más tarde" },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimit = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  message: { success: false, message:"demasiados intentos", error: "Demasiados intentos, intenta en 5 minutos" },
  standardHeaders: true,
  legacyHeaders: false,
});

export const resetLimit = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 3,
  message: { success: false, message:"Demasiados intentos, intenta denuevo en 1 minuto", error: "Revisa tu correo electronico para resetear la contraseña" },
  standardHeaders: true,
  legacyHeaders: false,
});
