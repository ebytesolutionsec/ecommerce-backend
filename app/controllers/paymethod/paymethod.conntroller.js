
import paymentMethodSchema from '../../models/paymethod/payment.method.models.js'

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
    }
}

export default paymethodCotroller