import { Router } from "express";
import { validateRol, verifyToken } from "@/middlewares/authMiddleware";
import { userController } from "@/controllers/userController";

const router = Router();


router.put("/user/:id",verifyToken, await validateRol('admin'), userController.updateUser);



export default router;
