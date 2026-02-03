import orderSchema from "../models/orders/orders.models.js"

const generateOrdenNumerHelper = {
    generateOrdenNumber : async () =>{
        const today = new Date()

        const datePart =
            today.getFullYear().toString() + 
            String(today.getMonth() + 1).padStart(2, '0') +
            String(today.getDate()).padStart(2,'0')
        
        const count = await orderSchema.countDocuments({
            createdAt: {
                $gte: new Date(today.setHours(0,0,0,0))
            }
        })

        const sequence = String(count + 1).padStart(4, '0')

        return `ORD-${datePart}-${sequence}`;
    }
}

export default generateOrdenNumerHelper