import axios from "axios"
import mongoose from "mongoose"
import orderSchmea from "../../models/orders/orders.models.js"
import paymentSchema from "../../models/payment/payment.models.js"
import productSchema from "../../models/producto/producto.models.js"

const payphoneController = {

    redirectPayphonePayment : async( req , res) => {
        try {
            
            const { amount, clientTransactionId,reference,responseUrl,cancellationUrl,amountWithoutTax } = req.body

            if(!amount || !clientTransactionId){
                return res.status(400).json({
                    messge : "Faltan datos obligatorios"
                })
            }

            const payload = {
                amount,
                clientTransactionId,
                reference,
                responseUrl,
                cancellationUrl,
                amountWithoutTax,
                ...req.body
            }

            const response = await axios.post(
                process.env.PAYPHONE_API_URL,
                payload,
                {
                    headers:{
                        Authorization: `Bearer ${process.env.TOKEN_PAYPHONE}`,
                        "Content-Type" : "application/json"
                    }
                }
            )

            return res.status(200).json({
                success: true,
                data: response.data
            })

        } catch (error) {
            
            console.error("Error Payphone:", error.response?.data || error.message);

            return res.status(500).json({
                success: false,
                message: "Error al comunicarse con Payphone",
                error: error.response?.data || error.message
            });

        }
    },

    verifyConfirmPayphone : async ( req, res ) => {

        const session = await mongoose.startSession();
        session.startTransaction()

        try {

            const { id , clientTransactionId } = req.body

            if(!id || !clientTransactionId){
                return res.status(400).json({
                    messge : "Faltan datos obligatorios"
                })
            }

            const response = await axios.post(
                process.env.PAYPHONE_API_CONFIRM,
                {id, clientTransactionId},
                {
                    headers:{
                        Authorization: `Bearer ${process.env.TOKEN_PAYPHONE}`,
                        "Content-Type" : "application/json"
                    }
                }
            )

            const payphoneData = response.data;

            const order = await orderSchmea.findById(clientTransactionId)
                .populate("items")
                .session(session)
            
            if(!order){
                throw new Error("Orden no encontrada")
            }

            const io = require("../../helper/socket.io.js").getIO()

            if(payphoneData.statusCode === 3){
                if(order.status === "paid"){
                    return res.status(200).json({
                        message : "Orden ya pagada previamente"
                    })
                }

                order.status = "paid"
                await order.save({ session })

                await paymentSchema.create(
                    [{
                        order: order._id,
                        transaction_id : id,
                        amount: order.total,
                        status: "approved",
                        provider_response: payphoneData
                    }]
                )

                await session.commitTransaction()
                session.endSession()

                //Socket
                io.emit("orderPaid", {
                    orderId: order._id,
                    status: "paid"
                })

                return res.status(200).json({
                    success: true,
                    message: "Pago aprobado",
                    data: payphoneData
                });
            }else{
                if(order.status === "pending"){
                    for(const item of order.items){
                        const product = await productSchema.findById(item.product).session(session)

                        product.stock += item.quantity
                        await product.save({ session })

                        io.emit("stockUpdated", {
                            productId: product._id,
                            change : item.quantity
                        })
                    }

                    order.status = "canceled",
                    await order.save({ session })
                }

                await session.commitTransaction()
                session.endSession()

                return res.status(200).json({
                    success: false,
                    message: "Pago no aprobado",
                    data: payphoneData
                });
            }
            
        } catch (error) {
            console.error("Error Payphone:", error.response?.data || error.message);

            return res.status(500).json({
                success: false,
                message: "Error al comunicarse con Payphone",
                error: error.response?.data || error.message
            });
        }

    }
}

export default payphoneController