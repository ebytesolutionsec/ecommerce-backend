import { Router } from "express";
import payphoneController from "../../controllers/payphone/payphone.controller.js"

const routerPayphone = Router()

/**
 * @swagger
 * /payphone/redirect:
 *   post:
 *     summary: Redireccionar caja de pagos
 *     description: |
 *       Redireccionar para la caja de pagos
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             amount: 100
 *             clientTransactionId: "Este es una codigo unico que lo generas desde el front, automanticamente por cada transacción"
 *             reference: "Nombre de referencia de la transacción"
 *             responseUrl: "La url de respuesta que vas a manejar desde el front cuando la transacción se complete"
 *             cancellationUrl: "La url de respuesta cuando la transacción de cancele"
 *     responses:
 *       201:
 *         description: Redicción completa
 *       400:
 *         description: Redirección cancelada
 *       500:
 *         description: Error interno del servidor
 */
routerPayphone.post('/payphone/redirect', payphoneController.redirectPayphonePayment)

export default routerPayphone