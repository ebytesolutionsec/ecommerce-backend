
import paymentMethodSchema from '../../models/paymethod/payment.method.models.js'
import paginationHelper from "../../helper/pagination.helper.js"


const paymethodCotroller = {

    createPaymentMethod : async ( req , res ) => {
        try {
            
            const { name, provider, active, config } = req.body;

            //Validaciones
            if (!name || !provider) {
                return res.status(400).json({
                    message: 'El nombre y el proveedor son obligatorios'
                });
            }

            //Evitar duplicados
            const exists = await paymentMethodSchema.findOne({
                name: name.trim(),
                provider: provider.trim()
            });

            if (exists) {
                return res.status(409).json({
                    message: 'El método de pago ya existe'
                });
            }

            const paymentMethod = await paymentMethodSchema.create({
                name: name.trim(),
                provider: provider.trim(),
                active: active !== undefined ? active : true,
                config
            });

            return res.status(201).json({
                message: 'Método de pago creado correctamente',
                paymentMethod
            });

        } catch (error) {
            return res.status(500).json({
                message: 'Error al crear el método de pago',
                error: error.message
            });
        }
    },

    listPaymentMethod : async ( req, res ) => {
        try {
            
            const { page, limit, ...filters } = req.query

            const result = await paginationHelper.paginate(paymentMethodSchema,{
                page, 
                limit, 
                filter: filters,
            })

            res.json(result)

        } catch (error) {
            res.status(500).json({ message: "Error al listar los pagos", error });
        }
    },

    editPaymentMethod : async ( req , res ) => {
        try {
            
            const { ... rest } = req.body

            const paymentMethod = await paymentMethodSchema.findByIdAndUpdate(
                req.params.id,
                { ...rest }
            )

            if(!paymentMethod){
                return res.status(404).json({ message : "Metodo de pago no encontrado"})
            }

            res.status(200).json({ 
                message: "Metodo de pago actualizado exitosamente", 
                paymentMethod 
            });

        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Error al editar el usuario", error: error})
        }
    },

    deletePaymentMethod : async ( req , res ) => {
        try {

            const paymentMethod = await paymentMethodSchema.findByIdAndDelete(req.params.id)

            if(!paymentMethod){
                return res.status(404).json({ message: "Método de pago no encontrado" })
            }

            res.status(200).json({ message: "Usuario eliminado exitosamente" })
            
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Error al editar el usuario", error: error})
        }
    }
}

export default paymethodCotroller