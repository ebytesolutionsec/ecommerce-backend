import mongoose from "mongoose";

const categoriaSchema = new mongoose.Schema({
    name : { type: String, required: true, unique: true },
    descripcion : { type: String, required: true },
    dateCreation : { type: Date, default: Date.now }
})

export default mongoose.model('Categoria', categoriaSchema)