import { Router } from "express";
import categoriaController from "../../controllers/categoria/categoria.controller.js"
import verifyToken from '../../middleware/auth.middleware.js'


const routerCategoria = Router()


/**
 * @swagger
 * /categoria/list:
 *   get:
 *     summary: Listar categorias con paginación
 *     description: Obtiene un listado paginado de categorias registradas en el sistema.
 *     tags: [Categoria]
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
 *         description: Lista de categorias obtenida correctamente
 *         content:
 *           application/json:
 *       400:
 *         description: Parámetros de paginación inválidos
 *       500:
 *         description: Error interno del servidor
 */
routerCategoria.get('/categoria/list', verifyToken, categoriaController.listCategoria);

/**
 * @swagger
 * /categoria/create:
 *   post:
 *     summary: Crear una nueva categoria
 *     description: |
 *       Crea una nueva categoria en el sistema.
 *     tags: [Categoria]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Categoria de Prueba"
 *             descripcion: "Descripcion de la categoria de prueba"
 *             dateCreation: "2024-01-01T00:00:00.000Z"
 *     responses:
 *       201:
 *         description: Categoria creado exitosamente
 *       400:
 *         description: Datos inválidos o categoria ya existente
 *       500:
 *         description: Error interno del servidor
 */
routerCategoria.post('/categoria/create', verifyToken, categoriaController.createCategoria);


/**
 * @swagger
 * /categoria/edit/{id}:
 *   patch:
 *     summary: Actualizar información de una categoria
 *     description: Actualiza parcialmente los datos de una categoria existente.
 *     tags: [Categoria]
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
 *             name: "Elvis Burgos Actualizado"
 *             descripcion: "Nueva descripción, Loja"
 *             dateCreation: "2024-01-01T00:00:00.000Z"
 *     responses:
 *       200:
 *         description: Categoria actualizado correctamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Categoria no encontrada
 *       500:
 *         description: Error interno del servidor
 */
routerCategoria.patch('/categoria/edit/:id', verifyToken, categoriaController.editCategoria);

/**
 * @swagger
 * /categoria/delete/{id}:
 *   delete:
 *     summary: Eliminar una categoria
 *     description: Elimina una categoria del sistema por su ID.
 *     tags: [Categoria]
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
routerCategoria.delete('/categoria/delete/:id', verifyToken, categoriaController.deleteCategoria);

export default routerCategoria;