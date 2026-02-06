import { Router } from "express";
import verifyToken from '../../middleware/auth.middleware.js'
import paymentController from '../../controllers/payment/payment.controller.js'

const routerPayment = Router()

/**
 * @swagger
 * /payment/order/{orderId}/pay:
 *   post:
 *     summary: Crear el pago
 *     tags: [Payment]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la orden
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             payment_method_id: "696dba310879b7c9a4a35602" 
 *             transaction_id : "PAYPHONE-987654321 - Esto viene de la pasarela de pagos que usemos"
 *             provider_response : {
 *                  "Aqui va toda la configuración de la pasarela de pago"
 *             }
 *     responses:
 *       201:
 *         description: Orden creado exitosamente
 *       400:
 *         description: Datos inválidos o Orden ya existente
 *       500:
 *         description: Error interno del servidor
 */
routerPayment.post('/payment/order/:orderId/pay', verifyToken, paymentController.createPaymentController )

/**
 * @swagger
 * /payment/list/all:
 *   get:
 *     summary: Listar todos los pagos
 *     tags: [Payment]
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
 *         description: Lista todos los pagos realizados
 *         content:
 *           application/json:
 *       400:
 *         description: Parámetros de paginación inválidos
 *       500:
 *         description: Error interno del servidor
 */
routerPayment.get('/payment/list/all', verifyToken, paymentController.listPaymentController )

export default routerPayment