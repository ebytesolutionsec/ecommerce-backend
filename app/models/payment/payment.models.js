import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    order : { type : mongoose.Schema.Types.ObjectId, ref : 'Order' },
    payment_method : { type : mongoose.Schema.Types.ObjectId, ref : 'PaymentMethod' },
    amount : { type : mongoose.Schema.Types.Decimal128, required : true },
    status : { type : String, enum : ['pending', 'approved', 'rejected', 'refunded'], default: 'pending'},
    transaction_id: { type: String },
    provider_response: { type: Object },
    paid_at: { type: Date }
},
    { timestamps : true }
)

export default mongoose.model('Payment', paymentSchema)