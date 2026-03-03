import { Router } from "express";
import verifyToken from '../../middleware/auth.middleware.js'
import paymentController from '../../controllers/payment/payment.controller.js'
import { uploadSingle } from "../../middleware/uploadFileMiddleware.js";

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

/**
 * @swagger
 * /payment/send/comprobante/{orderId}:
 *   post:
 *     summary: Enviar comprobante de pago
 *     tags: [Payment]
 *     description: |
 *       Envia el comprobante bancario
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - payment_method
 *               - amount
 *               - number_comprobante
 *               - proof_image
 *             properties:
 *               orderId:
 *                 type: string
 *                 example: id de la orden
 *               payment_method:
 *                 type: string
 *                 example: id del método de pago
 *               amount:
 *                 type: number
 *                 example: 10.0
 *               number_comprobante:
 *                 type: string
 *                 example: 13123123
 *               proof_image:
 *                 type: string
 *                 example: camiseta.png
 *     responses:
 *       201:
 *         description: Transferencia creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Transferencia creado correctamente
 *                 data:
 *                   type: object
 *       400:
 *         description: Campos obligatorios faltantes
 *       500:
 *         description: Error interno del servidor
 */
routerPayment.post('/payment/send/comprobante/:orderId', verifyToken, uploadSingle('uploads/payments/comprobant', 'proof_image'), paymentController.createPaymentTransaction)


/**
 * @swagger
 * /payment/aproved/{paymentId}:
 *   get:
 *     summary: Aprovar el pago realizado
 *     tags: [Payment]
 *     parameters:
 *       - in: query
 *         name: paymentId
 *         description: Id del pago
 *     responses:
 *       200:
 *         description: Actualiza el estado del pago
 *         content:
 *           application/json:
 *       400:
 *         description: Error al actualiar el apgo
 *       500:
 *         description: Error interno del servidor
 */
routerPayment.post('/payment/aproved/:paymentId', verifyToken, paymentController.aprovedPaymentAdmin)

export default routerPayment