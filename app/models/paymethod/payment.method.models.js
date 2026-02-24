import mongoose from "mongoose";

const paymentMethodSchema = new mongoose.Schema({
    name: { type: String, require: true },
    provider: { type: String, require: true },
    active: { type: Boolean, default: true },
    config: { type: Object }
},
    { timestamps : true }
)

export default mongoose.model('PaymentMethod', paymentMethodSchema)