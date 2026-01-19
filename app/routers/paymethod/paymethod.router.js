import { Router } from "express";
import payMethodController from "../../controllers/paymethod/paymethod.conntroller.js"
import verifyToken from '../../middleware/auth.middleware.js'

const routerPayMethod = Router()

routerPayMethod.post('/payment/method/create', verifyToken, payMethodController.createPaymentMethod)

export default routerPayMethod