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

export default routerOrders