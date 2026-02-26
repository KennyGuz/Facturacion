import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { platilloController } from "../controllers/platilloController.js";
import { rlimit } from "src/middlewares/ratelimitMiddleware.js";

const router = Router();

router.post("/platillo", rlimit, verifyToken, platilloController.createPlatillo);

router.get("/platillo/:id", rlimit, verifyToken, platilloController.getPlatillo);

router.get("/platillos", rlimit, verifyToken, platilloController.getPlatillos);

router.put("/platillo/:id", rlimit, verifyToken, platilloController.updatePlatillo);

router.delete("/platillo/:id", rlimit, verifyToken, platilloController.deletePlatillo);

export default router;
