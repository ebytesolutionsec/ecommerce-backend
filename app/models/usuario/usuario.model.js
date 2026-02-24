import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
    dni : { type: String, require: true, unique: true },
    fullName : { type: String, require: true },
    email : { type: String, require: true, unique: true },
    direccion : { type: String, require: true },
    role : { type: String, enum: ['superadmin', 'comprador'], default: 'user' },
    phone : { type: String , require: true },
    password : {  type : String,  require : true},
    dateCreation : { type: Date, default: Date.now }
})

export default mongoose.model('Usuario', usuarioSchema)