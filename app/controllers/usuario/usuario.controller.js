import bcrypt from 'bcryptjs';
import userSchema from "../../models/usuario/usuario.model.js"
import paginationHelper from "../../helper/pagination.helper.js"

const userController = {

    createUser: async (req, res) => {
        try {
            const { password, role, dni } = req.body;

            //Verificar si el usuario ya existe
            const existUser = await userSchema.findOne({ dni })

            if (existUser) {
                return res.status(400).json({ message: "Este usuario ya existe" })
            }

            let hashedPassword = null;
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt)


            const user = new userSchema({
                ...req.body,
                password: hashedPassword,
                dateCreation: new Date()
            });

            await user.save();

            res.status(201).json({
                message: "Usuario creado exitosamente",
                user: {
                    id: user._id,
                    email: user.email,
                    role: user.role
                }
            })

        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    userAllList: async (req, res) => {
        try {

            const { page, limit, ...filters } = req.query;

            const result = await paginationHelper.paginate(userSchema, { 
                page, 
                limit, 
                filter: filters,
            });

            res.json(result);

        } catch (error) {
            res.status(500).json({ message: "Error al listar los usuarios", error });
        }
    },

    editUser: async ( req, res ) => {
        try {

            const { dni, ...rest } = req.body;

            //Verificar si ya existe un usuario con esa cedula
            if(dni){
                const existingUser = await userSchema.findOne({ dni, _id: { $ne: req.params.id } });
                if (existingUser) {
                    return res.status(400).json({ message: "La cédula ya está registrada" });
                }
            }

            const user = await userSchema.findByIdAndUpdate(
                req.params.id,
                { dni, ...rest },
                { new: true }
            );

            if(!user){
                return res.status(404).json({ message : "Usuario no encontrado"})
            }

            res.status(200).json({ 
                message: "Usuario actualizada correctamente", 
                user 
            });

        } catch (error) {
            res.status(500).json({ message: "Error al editar el usuario", error: error})
        }
    },

    deleteUser : async ( req, res ) => {
        try {
            const user = await userSchema.findByIdAndDelete(req.params.id)

            if(!user){
                return res.status(404).json({ message: "Usuario no encontrado" })
            }
            res.status(200).json({ message: "Usuario eliminado exitosamente" })

        } catch (error) {
            res.status(500).json({ message: "Error al eliminar el usuario" })
        }
    },

    searchUser : async ( req, res ) => {
        try{
            const user = await userSchema.findById(req.params.id)

            if(!user){
                return res.status(404).json({ message : "Usuario no encontrado"})
            }

            return res.status(200).json( user )

        } catch (error){
            console.log(error)
            res.status(500).json({ message: "Error al obtener la información del Usuario" })
        }
    }

}

export default userController;