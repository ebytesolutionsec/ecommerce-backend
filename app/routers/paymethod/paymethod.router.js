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

/**
 * @swagger
 * /payment/method/list:
 *   get:
 *     summary: Listar todos los metodos de pago
 *     tags: [PaymentMethod]
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
routerPayMethod.get('/payment/method/list', verifyToken, payMethodController.listPaymentMethod)

/**
 * @swagger
 * /payment/method/{id}:
 *   patch:
 *     summary: Listar todos los metodos de pago
 *     tags: [PaymentMethod]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del metodo de pago a editar
 *     responses:
 *       200:
 *         description: Edita un metodo de pago
 *         content:
 *           application/json:
 *       400:
 *         description: Id proporcionado invalido
 *       500:
 *         description: Error interno del servidor
 */
routerPayMethod.patch('/payment/method/:id', verifyToken, payMethodController.editPaymentMethod)

/**
 * @swagger
 * /payment/method/{id}:
 *   delete:
 *     summary: Listar todos los metodos de pago
 *     tags: [PaymentMethod]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del metodo de pago a eliminar
 *     responses:
 *       200:
 *         description: Elimiar un metodo de pago
 *         content:
 *           application/json:
 *       400:
 *         description: Id proporcionado invalido
 *       500:
 *         description: Error interno del servidor
 */
routerPayMethod.delete('/payment/method/:id', verifyToken, payMethodController.deletePaymentMethod)

export default routerPayMethod