import mongoose from "mongoose";

const itemOrderSchema = new mongoose.Schema({
    order : { type : mongoose.Schema.Types.ObjectId, ref : 'Order', require: true },
    product : { type : mongoose.Schema.Types.ObjectId, ref : 'Producto', require: true},
    product_name : { type: String, require: true },
    product_sku : { type : String, require: true},
    quantity : { type : Number, require: true },
    unit_price: { type : Number, require: true },
    total_price: { type : Number, require: true }
},
    { timestamps :  true }
)

export default mongoose.model('ItemOrder', itemOrderSchema)