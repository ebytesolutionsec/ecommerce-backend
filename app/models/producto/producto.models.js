import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
    name : { type: String, require: true },
    sku: { type: String, require: true, unique: true },
    img_prod : { type: String },
    descripcion : { type: String, require: true },
    descripcion_corta : { type: String, require: true },
    categoria : { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria', require: true },
    precio : { type: Number, require: true },
    precio_descuento : { type: Number, default: 0 },
    stock : { type: Number, require: true },
    disponible : { type: Boolean, default: true },
    rating : { type: Number, default: 0 },
    destacado : { type: Boolean, default: false },
    estado : { type: Boolean, default: true },
    created_at : { type: Date, default: Date.now },
    updated_at : { type: Date, default: Date.now }
})

export default mongoose.model('Producto', productoSchema)