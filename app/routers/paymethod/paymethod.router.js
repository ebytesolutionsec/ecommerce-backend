import { Router } from "express";
import payMethodController from "../../controllers/paymethod/paymethod.conntroller.js"
import verifyToken from '../../middleware/auth.middleware.js'

const routerPayMethod = Router()

/**
 * @swagger
 * /payment/method/create:
 *   post:
 *     summary: Crear una nueva orden
 *     description: |
 *       Crea una nueva orden en el sistema.
 *     tags: [PaymentMethod]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Tarjeta debito" 
 *             provider : "Payphone"
 *             active : true
 *             config : {}
 *     responses:
 *       201:
 *         description: Orden creado exitosamente
 *       400:
 *         description: Datos inválidos o Orden ya existente
 *       500:
 *         description: Error interno del servidor
 */
routerPayMethod.post('/payment/method/create', verifyToken, payMethodController.createPaymentMethod)

export default routerPayMethod