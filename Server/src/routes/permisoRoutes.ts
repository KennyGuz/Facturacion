import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { permisoController } from "../controllers/permisoController.js";
import { rlimit } from "src/middlewares/ratelimitMiddleware.js";

const router = Router();

router.post("/permiso", rlimit, verifyToken, permisoController.createPermiso);

router.get("/permiso/:id", rlimit, verifyToken, permisoController.getPermiso);

router.get("/permisos", rlimit, verifyToken, permisoController.getPermisos);

router.put("/permiso/:id", rlimit, verifyToken, permisoController.updatePermiso);

router.delete("/permiso/:id", rlimit, verifyToken, permisoController.deletePermiso);

export default router;
