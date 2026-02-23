import { Router } from "express";
import { validateRol, verifyToken } from "@/middlewares/authMiddleware";
import { userController } from "@/controllers/userController";

const router = Router();

router.get("/user/:id",  verifyToken, validateRol('admin'), userController.getUser);
router.get("/users", verifyToken, validateRol('admin'), userController.getUsers);
router.put("/user/:id", verifyToken, validateRol('admin'), userController.updateUser);
router.delete("/user/:id", verifyToken, validateRol('admin'), userController.deleteUser);



export default router;
