import mongoose from "mongoose";

const itemOrderSchema = new mongoose.Schema({
    order : { type : mongoose.Schema.Types.ObjectId, ref : 'Order', required: true },
    product : { type : mongoose.Schema.Types.ObjectId, ref : 'Producto', required: true},
    product_name : { type: String, required: true },
    product_sku : { type : String, required: true},
    quantity : { type : Number, required: true },
    unit_price: { type : Number, required: true },
    total_price: { type : Number, required: true }
},
    { timestamps :  true }
)

export default mongoose.model('ItemOrder', itemOrderSchema)