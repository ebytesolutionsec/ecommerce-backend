import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
    dni : { type: String, required: true, unique: true },
    fullName : { type: String, required: true },
    email : { type: String, required: true, unique: true },
    direccion : { type: String, required: true },
    role : { type: String, enum: ['superadmin', 'comprador'], default: 'user' },
    phone : { type: String , required: true },
    password : {  type : String,  required : true},
    dateCreation : { type: Date, default: Date.now }
})

export default mongoose.model('Usuario', usuarioSchema)