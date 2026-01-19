import { Router } from "express";
import verifyToken from '../../middleware/auth.middleware.js'
import ordersController from '../../controllers/orders/orders.controller.js'

const routerOrders = Router()

routerOrders.post('/orders/create', verifyToken, ordersController.createOrderController)

export default routerOrders