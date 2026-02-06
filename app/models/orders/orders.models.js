import mongoose from "mongoose";

const ordersSchema = new mongoose.Schema({
    userId : { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    order_number : { type : String, required: true, unique : true },
    status : { type : String, enum : ['pending', 'paid', 'shipped', 'completed', 'canceled'], default: 'pending'},
    items : [{ type : mongoose.Schema.Types.ObjectId, ref : 'ItemOrder'}],
    subtotal : { type : Number , required: true },
    tax : { type : Number, default : 0 },
    shipping_cost: { type: Number, default: 0 },
    total: { type: Number, required: true },
    shipping_address: {
      country: String,
      city: String,
      address: String,
      zip: String
    },
    payment: { type : mongoose.Schema.Types.ObjectId, ref : 'Payment'},
},
    { timestamps : true }
)

export default mongoose.model('Order', ordersSchema)