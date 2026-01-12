import { Router } from "express";
import usuarioController from "../../controllers/usuario/usuario.controller.js"
import verifyToken from '../../middleware/auth.middleware.js'

const routerUsuario = Router()

/**
 * @swagger
 * /usuario/create:
 *   post:
 *     summary: Crear un nuevo usuario
 *     description: |
 *       Crea un nuevo usuario en el sistema.
 *       El correo electrónico y el DNI deben ser únicos.
 *       La contraseña se almacena de forma segura (hasheada).
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             dni: "111111111"
 *             fullName: "Usuario de Prueba"
 *             email: "test@email.com"
 *             direccion: "Loja, Ecuador"
 *             role: "comprador"
 *             phone: "0999999999"
 *             password: "12345678"
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Datos inválidos o usuario ya existente
 *       500:
 *         description: Error interno del servidor
 */
routerUsuario.post('/usuario/create', verifyToken, usuarioController.createUser);


/**
 * @swagger
 * /usuario/create/comprador:
 *   post:
 *     summary: Crear un nuevo usuario
 *     description: |
 *       Crea un nuevo usuario en el sistema.
 *       El correo electrónico y el DNI deben ser únicos.
 *       La contraseña se almacena de forma segura (hasheada).
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             dni: "111111111"
 *             fullName: "Usuario de Prueba"
 *             email: "test@email.com"
 *             direccion: "Loja, Ecuador"
 *             role: "comprador"
 *             phone: "0999999999"
 *             password: "12345678"
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Datos inválidos o usuario ya existente
 *       500:
 *         description: Error interno del servidor
 */
routerUsuario.post('/usuario/create/comprador', usuarioController.createUserComprador);

/**
 * @swagger
 * /usuario/list:
 *   get:
 *     summary: Listar usuarios con paginación
 *     description: Obtiene un listado paginado de usuarios registrados en el sistema.
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de registros por página
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida correctamente
 *         content:
 *           application/json:
 *       400:
 *         description: Parámetros de paginación inválidos
 *       500:
 *         description: Error interno del servidor
 */
routerUsuario.get('/usuario/list', verifyToken, usuarioController.userAllList);


/**
 * @swagger
 * /usuario/edit/{id}:
 *   patch:
 *     summary: Actualizar información de un usuario
 *     description: Actualiza parcialmente los datos de un usuario existente.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a editar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             fullName: "Elvis Burgos Actualizado"
 *             direccion: "Nueva dirección, Loja"
 *             phone: "0988888888"
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
routerUsuario.patch('/usuario/edit/:id', verifyToken, usuarioController.editUser);

/**
 * @swagger
 * /usuario/delete/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     description: Elimina un usuario del sistema por su ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario eliminado exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
routerUsuario.delete('/usuario/delete/:id',verifyToken, usuarioController.deleteUser);

/**
 * @swagger
 * /usuario/info/{id}:
 *   get:
 *     summary: Obtener información de un usuario
 *     description: Obtiene los datos detallados de un usuario por su ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Información del usuario obtenida correctamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
routerUsuario.get('/usuario/info/:id', verifyToken, usuarioController.searchUser)

export default routerUsuario;