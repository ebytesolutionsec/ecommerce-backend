import productoSchema from "../../models/producto/producto.models.js"
import paginationHelper from "../../helper/pagination.helper.js"
import fs from 'fs';


const productoController = {

    createProducto: async (req, res) => {
        try {

            const {
                name, sku, descripcion, descripcion_corta, categoria, precio,
                precio_descuento, stock, disponible, rating, destacado, estado
            } = req.body;

            if (
                !name ||
                !sku ||
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

            if(!req.file){
                return res.status(400).json({ message: 'No se subio ninguina imagen'})
            }

            console.log(req.file)

            // 🔐 Verificar SKU duplicado
            const existeSku = await productoSchema.findOne({ sku });

            if (existeSku) {
                fs.unlinkSync(req.file.path);
                return res.status(409).json({
                    ok: false,
                    message: 'Ya existe un producto con este SKU'
                });
            }

            const nuevoProducto = new productoSchema({
                name,
                sku,
                img_prod : `/uploads/productos/${req.file.filename}`,
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
            console.log(error)
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
    },

    infoProducto : async ( req, res ) => {
        try {
            
            const { id } = req.params

            const producto = await productoSchema.findById( id )

            if(!producto){
                return res.status(400).json({ message : "Producto no encontrado"})
            }

            return res.status(200).json({
                data : producto
            })

        } catch (error) {
            return res.status(500).json({
                message: 'Error al buscar el producto',
                error: error.message
            })
        }
    },

    searchProducto : async ( req, res ) => {
        try {
            const { q = "", page = 1, limit = 10 } = req.query

            const regex = new RegExp(q,'i')

            const matchConditions = []

            if(q){
                matchConditions.push({
                    $or: [
                        { name : regex },
                        { 'categoria.name': regex }
                    ]
                })
            }

            const pipeline = [
                {
                    $lookup: {
                        from: 'categorias',
                        localField: 'categoria',
                        foreignField: '_id',
                        as: 'categoria'
                    }
                },
                { $unwind: '$categoria' },

                {
                    $match: matchConditions.length > 0 ? { $and: matchConditions } : {}
                }
            ]

            const totalPipeline = [...pipeline, { $count : 'total'}]
            const totalResult = await productoSchema.aggregate(totalPipeline)

            const total = totalResult.length > 0 ? totalResult[0].total : 0

            const skip = ( Number(page) - 1 ) * Number(limit)
            
            const dataPipeline = [
                ...pipeline,
                { $skip: skip },
                { $limit: Number(limit) }
            ]

            const producto = await productoSchema.aggregate(dataPipeline)
            res.json({
                total,
                page:Number(page),
                totalPages: Math.ceil(total / limit),
                limit: Number(limit),
                data: producto
            })
            

        } catch ( error ) {

            console.error(error)
            res.status(500).json({ message: error.message })
            
        }
    }

}

export default productoController