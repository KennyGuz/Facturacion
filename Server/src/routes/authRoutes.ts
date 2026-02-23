import { Router } from "express";
import { authController } from "@/controllers/authController";
import { validateRol, verifyToken } from "@/middlewares/authMiddleware";

const router = Router();


router.post("/register",verifyToken, await validateRol('admin'), authController.register);

router.post("/login", authController.login);


export default router;
