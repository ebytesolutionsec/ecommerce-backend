import productoSchema from "../../models/producto/producto.models.js"
import paginationHelper from "../../helper/pagination.helper.js"

const productoController = {

    createProducto: async (req, res) => {
        try {

            const {
                name, sku, img_prod, descripcion, descripcion_corta, categoria, precio,
                precio_descuento, stock, disponible, rating, destacado, estado
            } = req.body;

            if (
                !name ||
                !sku ||
                !img_prod ||
                !descripcion ||
                !descripcion_corta ||
                !categoria ||
                precio === undefined ||
                stock === undefined
            ) {
                return res.status(400).json({
                    ok: false,
                    message: 'Todos los campos obligatorios deben ser enviados'
                })
            }

            // 🔐 Verificar SKU duplicado
            const existeSku = await productoSchema.findOne({ sku })
            if (existeSku) {
                return res.status(409).json({
                    ok: false,
                    message: 'Ya existe un producto con este SKU'
                })
            }

            const nuevoProducto = new productoSchema({
                name,
                sku,
                img_prod,
                descripcion,
                descripcion_corta,
                categoria,
                precio,
                precio_descuento,
                stock,
                disponible,
                rating,
                destacado,
                estado
            })

            const productoGuardado = await nuevoProducto.save()

            return res.status(201).json({
                ok: true,
                message: 'Producto creado correctamente',
                data: productoGuardado
            })

        } catch (error) {
            return res.status(500).json({
                ok: false,
                message: 'Error al crear el producto',
                error: error.message
            })
        }
    },

    listProducto : async ( req, res ) => {
        try {
            
            const { page, limit, ...filters } = req.query;

            const result = await paginationHelper.paginate(productoSchema, { 
                page, 
                limit, 
                filter: filters,
            });

            res.json(result);

        } catch (error) {
            res.status(500).json({ message: "Error al listar los productos", error });
        }
    }
}

export default productoController