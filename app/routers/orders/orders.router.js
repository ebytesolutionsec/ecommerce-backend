import { Router } from "express";
import verifyToken from '../../middleware/auth.middleware.js'
import ordersController from '../../controllers/orders/orders.controller.js'

const routerOrders = Router()


/**
 * @swagger
 * /orders/create:
 *   post:
 *     summary: Crear una nueva orden
 *     description: |
 *       Crea una nueva orden en el sistema.
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             items: [
 *                  {
 *                      productId : "695e8bf2a9013b0391b903d2",
 *                      quantity : 10
 *                  },
 *                  {
 *                      productId : "695e8bf2a9013b0391b903d2",
 *                      quantity : 10
 *                  }
 *             ]
 *     responses:
 *       201:
 *         description: Orden creado exitosamente
 *       400:
 *         description: Datos inválidos o Orden ya existente
 *       500:
 *         description: Error interno del servidor
 */
routerOrders.post('/orders/create', verifyToken, ordersController.createOrderController)

/**
 * @swagger
 * /orders/list:
 *   get:
 *     summary: Listar ordenes con paginación
 *     description: Obtiene un listado paginado de ordenes registrados en el sistema.
 *     tags: [Orders]
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
 *         description: Lista de ordenes obtenida correctamente
 *         content:
 *           application/json:
 *       400:
 *         description: Parámetros de paginación inválidos
 *       500:
 *         description: Error interno del servidor
 */
routerOrders.get('/orders/list', verifyToken, ordersController.listOrders)

export default routerOrders