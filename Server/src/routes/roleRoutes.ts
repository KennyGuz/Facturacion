import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { roleController } from "../controllers/roleController.js";
import { rlimit } from "src/middlewares/ratelimitMiddleware.js";

const router = Router();

router.post("/rol", rlimit, verifyToken, roleController.createRole);

router.get("/rol/:id", rlimit, verifyToken, roleController.getRole);

router.get("/roles", rlimit, verifyToken, roleController.getRoles);

router.put("/rol/:id", rlimit, verifyToken, roleController.updateRole);

router.delete("/rol/:id", rlimit, verifyToken, roleController.deleteRole);

export default router;
