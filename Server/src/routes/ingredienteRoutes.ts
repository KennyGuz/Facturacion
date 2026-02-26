import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { ingredienteController } from "../controllers/ingredienteController.js";
import { rlimit } from "src/middlewares/ratelimitMiddleware.js";

const router = Router();

router.post("/ingrediente", rlimit, verifyToken, ingredienteController.createIngrediente);

router.get("/ingrediente/:id", rlimit, verifyToken, ingredienteController.getIngrediente);

router.get("/ingredientes", rlimit, verifyToken, ingredienteController.getIngredientes);

router.put("/ingrediente/:id", rlimit, verifyToken, ingredienteController.updateIngrediente);

router.delete("/ingrediente/:id", rlimit, verifyToken, ingredienteController.deleteIngrediente);

export default router;
