import { Router } from "express";
import { validatePermisos, verifyToken } from "../middlewares/authMiddleware.js";
import { userController } from "../controllers/userController.js";
import { rlimit } from "src/middlewares/ratelimitMiddleware.js";

const router = Router();


/**
 * @swagger
 * tags:
 *   name: usuarios
 *   description: Gestion de usuarios del sistema
 */

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: buscar usuario por id
 *     tags: [usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Id del usuario
 *     responses:
 *       200:
 *         description: El usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *             example:
 *               success: true
 *               message: OK
 *               data:
 *                 id: 1
 *                 email: luis@gmail.com
 *                 password: 123456
 *                 nombre: Luis
 *                 apellido: Díaz
 *                 cedula: 123456789
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
 *                 limit: debe ser un numero
 */
router.get("/user/:id", rlimit, verifyToken, userController.getUser);


/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: buscar usuario actual
 *     tags: [usuarios]
 *     responses:
 *       200:
 *         description: El usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *             example:
 *               success: true
 *               message: OK
 *               data:
 *                 id: 1
 *                 email: luis@gmail.com
 *                 password: 123456
 *                 nombre: Luis
 *                 apellido: Díaz
 *                 cedula: 123456789
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
 *                 limit: debe ser un numero
 */
router.get("/profile", rlimit, verifyToken, userController.getProfile);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Buscar usuarios
 *     tags: [usuarios]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Limitar resultados
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Desplazar resultados
 *     responses:
 *       200:
 *         description: Usuarios encontrados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *             example:
 *               success: true
 *               message: OK
 *               data:
 *                 users:
 *                   - id: 1
 *                     email: luis@gmail.com
 *                     nombre: Luis
 *                     apellido: Díaz
 *                     cedula: "123456789"
 *                 total: 1
 *                 limit: 10
 *                 page: 1
 *                 pages: 1
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *             example:
 *               success: false
 *               message: Datos inválidos
 *               errors:
 *                 limit: Debe ser un número
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
router.get("/users", rlimit, verifyToken, validatePermisos('admin'), userController.getUsers);

/**
 * @swagger
 * /api/user/{id}:
 *   put:
 *     summary: Actualizar usuario
 *     tags: [usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Id del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: Usuarios encontrados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *             example:
 *               success: true
 *               message: usuario actualizado
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *             example:
 *               success: false
 *               message: Datos inválidos
 *               errors:
 *                 email: Debe ser un correo electronico
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
router.put("/user/:id", rlimit, verifyToken, validatePermisos('admin'), userController.updateUser);

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     summary: Inactivar usuario
 *     tags: [usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Id del usuario
 *     responses:
 *       200:
 *         description: El usuario fue inactivado correctamente
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
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 *             example:
 *               success: false
 *               message: usuario no encontrado
 */
router.delete("/user/:id", rlimit, verifyToken, validatePermisos('admin'), userController.deleteUser);



export default router;
