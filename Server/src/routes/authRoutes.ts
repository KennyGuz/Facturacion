import { Router } from "express";
import { authController } from "../controllers/authController.js";
import { validatePermisos, verifyToken } from "../middlewares/authMiddleware.js";
import { verifyResetToken } from "src/middlewares/resetPasswordMiddleware.js";
import { authLimit, resetLimit, rlimit } from "src/middlewares/ratelimitMiddleware.js";

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
router.post("/register", rlimit, verifyToken, validatePermisos('admin'), authController.register);



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
router.post("/login", authLimit, authController.login);


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
router.post("/logout", rlimit, authController.logout);



/**
 * @swagger
 * /api/resetpassword:
 *   post:
 *     summary: Genera el token para resetear contraseña
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
 *     responses:
 *       201:
 *         description: El usuario envió el correo electronico con el link de reseteo de contraseña
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
 */
router.post("/resetpassword",resetLimit, authController.sendResetPassword);

/**
 * @swagger
 * /api/validateResetToken:
 *   post:
 *     summary: validar el token de reseteo de contraseña
 *     tags: [autenticacion]
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token de reseteo de contraseña
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: Contraseña nueva
 *     responses:
 *       201:
 *         description: El usuario envió el correo electronico con el link de reseteo de contraseña
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *             example:
 *               success: true
 *               message: se reseteo la contraseña
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
router.post("/validateResetToken", authLimit,verifyResetToken, authController.resetPassword);



export default router;
