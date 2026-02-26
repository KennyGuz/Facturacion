import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { reservaController } from "../controllers/reservaController.js";
import { rlimit } from "src/middlewares/ratelimitMiddleware.js";

const router = Router();

router.post("/reserva", rlimit, verifyToken, reservaController.createReserva);

router.get("/reserva/:id", rlimit, verifyToken, reservaController.getReserva);

router.get("/reservas", rlimit, verifyToken, reservaController.getReservas);

router.put("/reserva/:id", rlimit, verifyToken, reservaController.updateReserva);

router.delete("/reserva/:id", rlimit, verifyToken, reservaController.deleteReserva);

export default router;
