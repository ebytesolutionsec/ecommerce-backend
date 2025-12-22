import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
    name : { type: String, required: true },
    //Codigo unico para cada producto
    sku: { type: String, required: true, unique: true },
    img_prod : { type: String },
    descripcion : { type: String, required: true },
    descripcion_corta : { type: String, required: true },
    categoria : { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria', required: true },
    precio : { type: Number, required: true },
    precio_descuento : { type: Number, default: 0 },
    stock : { type: Number, required: true },
    disponible : { type: Boolean, default: true },
    rating : { type: Number, default: 0 },
    destacado : { type: Boolean, default: false },
    estado : { type: Boolean, default: true },
    created_at : { type: Date, default: Date.now },
    updated_at : { type: Date, default: Date.now }
})

export default mongoose.model('Producto', productoSchema)