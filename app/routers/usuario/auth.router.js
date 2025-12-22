import { Router } from "express";
import authController from '../../controllers/usuario/auth.controller.js';

const routerAuth = Router()

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     description: >
 *       Permite autenticar a un usuario en el sistema mediante sus credenciales.
 *       Valida el correo electrónico y la contraseña y, si son correctos,
 *       retorna un token JWT para acceder a los recursos protegidos.
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@email.com
 *               password:
 *                 type: string
 *                 example: 12345678
 *     responses:
 *       200:
 *         description: Usuario autenticado correctamente
 *       401:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error interno del servidor
 */
routerAuth.post('/login', authController.auth)

export default routerAuth;