import mongoose from "mongoose"
import productoSchema from "../../models/producto/producto.models.js";
import ordersSchema from "../../models/orders/orders.models.js"
import itemOrderSchema from "../../models/item/item.order.models.js"

const ordersController = {

    createOrderController : async ( req , res ) => {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            
            const userId = req.user.id; //Viene del middleware verifitoken
            const { items, shipping_address } = req.body

            console.log(userId)

            if(!items || items.length === 0 ){
                return res.status(400).json({ message : 'La orden debe tener al menos un producto'})
            }

            let subtotal = 0
            let itemOrders = []

            //Validar productos y stock
            for(const item of items){
                const product = await productoSchema.findById(item.productId).session(session)

                console.log(item.productId)

                if(!product || product.estado !== true){
                    throw new Error("Producto no disponible")
                }

                if(product.stock < item.quantity){
                    throw new Error(`Stock insuficiente para ${product.name}`)
                }

                const unitPrice = product.precio_descuento || product.precio
                const totalPrice = unitPrice * item.quantity

                subtotal += totalPrice

                itemOrders.push({
                    product : product._id,
                    product_name : product.name,
                    product_sku : product.sku,
                    quantity : item.quantity,
                    unit_price : unitPrice,
                    total_price : totalPrice
                });

                product.stock -= item.quantity

                await product.save({ session })
            }

            const tax = subtotal * 0.12
            const shipping_cost = 0;
            const total = subtotal + tax + shipping_cost

            //Crear Orden
            const order = await ordersSchema.create(
                [
                    {
                        userId : userId,
                        subtotal,
                        tax,
                        shipping_cost,
                        total,
                        shipping_address
                    }
                ],
                
                { session }
            );

            //Crear ItemORders
            const createItems = await itemOrderSchema.insertMany(
                itemOrders.map( item => ({
                    ...item,
                    order: order[0]._id
                })),
                { session }
            )

            //Asociar items a la ordern
            order[0].items = createItems.map( item => item._id)
            await order[0].save({ session })

            await session.commitTransaction();
            session.endSession();

            return res.status(201).json({
                message : 'Order creada correctamente',
                order: order[0]
            })
            

        } catch (error) {
            await session.abortTransaction();
            session.endSession()

            return res.status(500).json({
                message: 'Error al crear la orden',
                error: error.message
            })
        }
    }
}

export default ordersController