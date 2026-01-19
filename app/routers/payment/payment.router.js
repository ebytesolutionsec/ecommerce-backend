import { Router } from "express";
import verifyToken from '../../middleware/auth.middleware.js'
import paymentController from '../../controllers/payment/payment.controller.js'

const routerPayment = Router()

routerPayment.post('/payment/order/:orderId/pay', verifyToken, paymentController.createPaymentController )

export default routerPayment