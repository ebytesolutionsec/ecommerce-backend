import axios from "axios"

const payphoneController = {

    redirectPayphonePayment : async( req , res) => {
        try {
            
            const { amount, clientTransactionId,reference,responseUrl,cancellationUrl,amountWithoutTax } = req.body

            if(!amount || !clientTransactionId){
                return res.status(400).json({
                    messge : "Faltan datos obligatorios"
                })
            }

            const payload = {
                amount,
                clientTransactionId,
                reference,
                responseUrl,
                cancellationUrl,
                amountWithoutTax,
                ...req.body
            }

            const response = await axios.post(
                process.env.PAYPHONE_API_URL,
                payload,
                {
                    headers:{
                        Authorization: `Bearer ${process.env.TOKEN_PAYPHONE}`,
                        "Content-Type" : "application/json"
                    }
                }
            )

            return res.status(200).json({
                success: true,
                data: response.data
            })

        } catch (error) {
            
            console.error("Error Payphone:", error.response?.data || error.message);

            return res.status(500).json({
                success: false,
                message: "Error al comunicarse con Payphone",
                error: error.response?.data || error.message
            });

        }
    },

    verifyConfirmPayphone : async ( req, res ) => {

        try {

            const { id , clientTransactionId } = req.body

            if(!id || !clientTransactionId){
                return res.status(400).json({
                    messge : "Faltan datos obligatorios"
                })
            }

            const response = await axios.post(
                process.env.PAYPHONE_API_URL,
                {id, clientTransactionId},
                {
                    headers:{
                        Authorization: `Bearer ${process.env.TOKEN_PAYPHONE}`,
                        "Content-Type" : "application/json"
                    }
                }
            )

            return res.status(200).json({
                success: true,
                data: response.data
            })
            
        } catch (error) {
            console.error("Error Payphone:", error.response?.data || error.message);

            return res.status(500).json({
                success: false,
                message: "Error al comunicarse con Payphone",
                error: error.response?.data || error.message
            });
        }

    }
}

export default payphoneController