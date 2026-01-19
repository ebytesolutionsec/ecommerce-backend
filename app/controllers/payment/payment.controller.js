import orderSchema from "../../models/orders/orders.models.js"
import paymentMethodSchema from "../../models/paymethod/payment.method.models.js"
import paymentSchema from "../../models/payment/payment.models.js"
import mongoose from "mongoose"

const paymentController = {

    createPaymentController : async ( req , res ) => {
        const session = await mongoose.startSession()
        session.startTransaction();

        try {
            
            const userId = req.user.id
            const { orderId } = req.params
            const { payment_method_id, transaction_id, provider_response } = req.body;
            
            //Buscar Orden
            const order = await orderSchema.findById(orderId).session(session)

            if(!order){
                return res.status(404).json({ message : "Orden no encontrada"})
            }

            if(order.userId.toString() !== userId){
                return res.status(403).json({ message : "No autorizado para pafar esta orden"})
            }

            if(order.status !== 'pending'){
                return res.status(400).json({ message : `La orden no puede ser pagada, estado actual: ${order.status}` })
            }

            //Validar metodo de pago
            const paymentMethod = await paymentMethodSchema.findById(payment_method_id).session(session)

            if (!paymentMethod || !paymentMethod.active) {
                return res.status(400).json({ message: 'Método de pago no disponible' });
            }

            //Verificar si ya existe un pago aprobado
            const existingPayment = await paymentSchema.findOne({
                order : order._id,
                status : 'approved'
            }).session(session)

            if(existingPayment){
                return res.status(400).json({ message: 'La orden ya fue pagada' });
            }

            //Crear Pago
            const payment = await paymentSchema.create(
                [
                    {
                        order: order._id,
                        payment_method: paymentMethod._id,
                        amount: order.total,
                        status : 'approved',
                        transaction_id,
                        provider_response,
                        paid_at: new Date()
                    }
                ],

                { session }
            )

            //Actualizar orden
            order.status = 'paid'
            order.payment = payment[0]._id

            await order.save({ session })

            await session.commitTransaction();
            session.endSession();

            return res.status(200).json({
                message: 'Pago registrado correctamente',
                order,
                payment: payment[0]
            });

        } catch (error) {

            await session.abortTransaction()
            session.endSession();
            
            return res.status(500).json({
                message: 'Error al procesar el pago',
                error: error.message
            });
        }
    }

}

export default paymentController