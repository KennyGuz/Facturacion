import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { mesaController } from "../controllers/mesaController.js";
import { rlimit } from "src/middlewares/ratelimitMiddleware.js";

const router = Router();

router.post("/mesa", rlimit, verifyToken, mesaController.createMesa);

router.get("/mesa/:id", rlimit, verifyToken, mesaController.getMesa);

router.get("/mesas", rlimit, verifyToken, mesaController.getMesas);

router.put("/mesa/:id", rlimit, verifyToken, mesaController.updateMesa);

router.delete("/mesa/:id", rlimit, verifyToken, mesaController.deleteMesa);

export default router;
