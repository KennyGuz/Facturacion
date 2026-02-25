import { Router } from "express";
import { authController } from "../controllers/authController.js";
import { validateRol, verifyToken } from "../middlewares/authMiddleware.js";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: Correo electronico del usuario
 *         password:
 *           type: string
 *           description: Contraseña del usuario
 *         nombre:
 *           type: string
 *           description: Nombre del usuario
 *         apellido:
 *           type: string
 *           description: Apellido del usuario
 *         cedula:
 *           type: string
 *           description: Cedula del usuario
 * 
 *     Response:
 *       type: object
 *       required:
 *         - success
 *         - message
 *       properties:
 *         success:
 *           type: boolean
 *           description: Define si la petición tuvo éxito o no
 *         message:
 *           type: string
 *           description: Mensaje de respuesta
 *         data:
 *           type: object
 *           description: Datos devueltos por la petición
 *         error:
 *           type: string
 *           description: Mensaje de error simple
 *         errors:
 *           type: object
 *           description: Lista de errores util para validar formularios
 *
 *       example:
 *         success: true
 *         message: OK
 *
 */

/**
 * @swagger
 * tags:
 *   name: autenticacion
 *   description: Adivina que hace?
 */

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Crear un usuario nuevo
 *     tags: [autenticacion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       201:
 *         description: El usuario fue creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *             example:
 *               success: true
 *               message: OK
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *             example:
 *               success: false
 *               message: Error interno del servidor
 *       400:
 *         description: Datos invalidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *             example:
 *               success: false
 *               message: Datos invalidos
 *               errors:
 *                 email: Email invalido
 *                 password: Contraseña demasiado corta
 *                 nombre: Nombre demasiado corto
 *                 apellido: Apellido demasiado corto
 *                 cedula: Cedula demasiado corta
 */
router.post("/register", verifyToken, validateRol('admin'), authController.register);



/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login de un usuario
 *     tags: [autenticacion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electronico del usuario
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *     responses:
 *       201:
 *         description: El usuario inicio sesion correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *             example:
 *               success: true
 *               message: OK
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *             example:
 *               success: false
 *               message: Error interno del servidor
 *       400:
 *         description: Datos invalidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *             example:
 *               success: false
 *               message: El usuario o contraseña incorrectos
 */
router.post("/login", authController.login);


/**
 * @swagger
 * /api/logout:
 *   post:
 *     summary: Login de un usuario
 *     tags: [autenticacion]
 *     responses:
 *       201:
 *         description: El usuario cerro sesion correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *             example:
 *               success: true
 *               message: Sesion cerrada
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *             example:
 *               success: false
 *               message: Error interno del servidor
 */
router.post("/logout", authController.logout);


export default router;
