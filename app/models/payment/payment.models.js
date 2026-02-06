import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    order : { type : mongoose.Schema.Types.ObjectId, ref : 'Order', require : true},
    payment_method : { type : mongoose.Schema.Types.ObjectId, ref : 'PaymentMethod', require: true },
    amount : { type : mongoose.Schema.Types.Decimal128, require : true },
    status : { type : String, enum : ['pending', 'approved', 'rejected', 'refunded'], default: 'pending'},
    transaction_id: { type: String },
    provider_response: { type: Object },
    paid_at: { type: Date }
},
    { timestamps : true }
)

export default mongoose.model('Payment', paymentSchema)