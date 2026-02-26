import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { facturaController } from "../controllers/facturaController.js";
import { rlimit } from "src/middlewares/ratelimitMiddleware.js";

const router = Router();

router.post("/factura", rlimit, verifyToken, facturaController.createFactura);

router.get("/factura/:id", rlimit, verifyToken, facturaController.getFactura);

router.get("/facturas", rlimit, verifyToken, facturaController.getFacturas);

router.put("/factura/:id", rlimit, verifyToken, facturaController.updateFactura);

router.delete("/factura/:id", rlimit, verifyToken, facturaController.deleteFactura);

export default router;
