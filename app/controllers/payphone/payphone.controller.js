import axios from "axios"
import mongoose from "mongoose"
import orderSchmea from "../../models/orders/orders.models.js"
import paymentSchema from "../../models/payment/payment.models.js"
import productSchema from "../../models/producto/producto.models.js"
import socket from "../../helper/socket.io.js"

const payphoneController = {

    redirectPayphonePayment: async (req, res) => {
        try {

            const { amount, clientTransactionId, reference, responseUrl, cancellationUrl, amountWithoutTax } = req.body

            if (!amount || !clientTransactionId) {
                return res.status(400).json({
                    messge: "Faltan datos obligatorios"
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
                    headers: {
                        Authorization: `Bearer ${process.env.TOKEN_PAYPHONE}`,
                        "Content-Type": "application/json"
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

    verifyConfirmPayphone: async (req, res) => {

        const session = await mongoose.startSession();
        session.startTransaction()

        try {

            console.log("Aquii")

            const { id, clientTransactionId, idOrden, idPaymentMethod } = req.body

            console.log("ID", id, "Client", clientTransactionId, "order", idOrden, "Payment Metod", idPaymentMethod)

            if (!id || !clientTransactionId || !idOrden || !idPaymentMethod) {
                return res.status(400).json({
                    messge: "Faltan datos obligatorios"
                })
            }

            if (id === "0" || id === 0) {
                const order = await orderSchmea.findById(idOrden)
                    .populate("items")
                    .session(session)

                if (!order) {
                    await session.abortTransaction()
                    session.endSession()
                    return res.status(404).json({ message: "Orden no encontrada" })
                }

                const io = socket.getIO()

                if (order.status === "pending") {
                    for (const item of order.items) {
                        const product = await productSchema.findById(item.product).session(session)
                        product.stock += item.quantity
                        await product.save({ session })
                        io.emit("stockUpdated", { productId: product._id, change: item.quantity })
                    }
                    order.status = "canceled"
                    await order.save({ session })
                }

                await session.commitTransaction()
                session.endSession()

                return res.status(200).json({
                    success: false,
                    message: "Pago cancelado por el usuario"
                })
            }

            const response = await axios.post(
                process.env.PAYPHONE_API_CONFIRM,
                {
                    id: id,
                    clientTxId: clientTransactionId
                },

                {
                    headers: {
                        Authorization: `Bearer ${process.env.TOKEN_PAYPHONE}`,
                        "Content-Type": "application/json"
                    }
                }
            )

            const payphoneData = response.data;

            const order = await orderSchmea.findById(idOrden)
                .populate("items")
                .session(session)

            if (!order) {
                throw new Error("Orden no encontrada")
            }

            console.log("Orden", order)

            const io = socket.getIO()

            console.log("Payphone Data", payphoneData)

            if (payphoneData.statusCode === 3) {
                if (order.status === "paid") {
                    return res.status(200).json({
                        message: "Orden ya pagada previamente"
                    })
                }

                for (const item of order.items) {
                    const product = await productSchema.findById(item.product).session(session)

                    product.stock -= item.quantity
                    await product.save({ session })

                    io.emit("stockUpdated", {
                        productId: product._id,
                        change: item.quantity
                    })
                }

                order.status = "paid"
                await order.save({ session })

                await paymentSchema.create(
                    [{
                        order: order._id,
                        transaction_id: id,
                        amount: order.total,
                        status: "approved",
                        provider_response: payphoneData,
                        payment_method: idPaymentMethod
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
            } else {
                console.log("Entre aqui")
                if (order.status === "pending") {
                    for (const item of order.items) {
                        const product = await productSchema.findById(item.product).session(session)

                        product.stock += item.quantity
                        await product.save({ session })

                        io.emit("stockUpdated", {
                            productId: product._id,
                            change: item.quantity
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