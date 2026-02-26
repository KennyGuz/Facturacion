import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { ordenController } from "../controllers/ordenController.js";
import { rlimit } from "src/middlewares/ratelimitMiddleware.js";

const router = Router();

router.post("/orden", rlimit, verifyToken, ordenController.createOrden);

router.get("/orden/:id", rlimit, verifyToken, ordenController.getOrden);

router.get("/ordenes", rlimit, verifyToken, ordenController.getOrdens);

router.put("/orden/:id", rlimit, verifyToken, ordenController.updateOrden);

router.delete("/orden/:id", rlimit, verifyToken, ordenController.deleteOrden);

export default router;
