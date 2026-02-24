import mongoose from "mongoose";

const categoriaSchema = new mongoose.Schema({
    name : { type: String, require: true, unique: true },
    descripcion : { type: String, require: true },
    dateCreation : { type: Date, default: Date.now }
})

export default mongoose.model('Categoria', categoriaSchema)