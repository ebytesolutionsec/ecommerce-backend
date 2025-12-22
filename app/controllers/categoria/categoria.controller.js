import categoriaSchema from "../../models/categoria/categoria.models.js"
import paginationHelper from "../../helper/pagination.helper.js"

const categoriaController = {
    
    createCategoria : async ( req, res ) => {
        try {
            const { nombre } = req.body;

            //Veririficar si la caterogia existe
            const categoryExist = await categoriaSchema.findOne({ nombre})

            if( categoryExist ){
                return res.status(400).json({ message: "Esta categoria ya existe" })
            }

            const categoria = new categoriaSchema({
                ...req.body,
                dateCreation: new Date()
            })

            await categoria.save();

            res.status(201).json({
                message: "Categoria creada exitosamente",
                categoria: categoria
            })
        } catch (error) {
            res.status(400).json({ message: error.message });
        }   
    },

    editCategoria : async ( req, res ) => {
        try {
            const { name, ...rest } = req.body;

            if( name ){
                const existCategory = await categoriaSchema.findOne({ name, _id : { $ne: req.params.id }})

                if( existCategory ){
                    return res.status(400).json({ message: "Esta categoria ya existe" })
                }
            }

            const category = await categoriaSchema.findByIdAndUpdate(
                req.params.id,
                { name, ...rest },
                { new: true }
            )

            if( !category ){
                return res.status(404).json({ message : "Categoria no encontrada"})
            }

            res.status(200).json({
                message: "Categoria actualizada exitosamente",
                category: category
            })


        } catch (error) {
            res.status(500).json({ message: "Error al editar la categoria", error: error})
        }
    },

    deleteCategoria : async ( req, res ) => {
        try {
            
            const category = await categoriaSchema.findById( req.params.id )

            if( !category ){
                return res.status(404).json({ message : "Categoria no encontrada"})
            }

            return res.status(200).json({ category })

        } catch (error) {
            return res.status(500).json({ message: "Error al eliminar la categoria", error: error}) 
        }
    },

    listCategoria : async ( req, res ) => {
        try {
            const { page, limit, ...filters } = req.query;

            const result = await paginationHelper.paginate(categoriaSchema, { 
                page, 
                limit, 
                filter: filters,
            });

            res.json(result);

        } catch (error) {
            res.status(500).json({ message: "Error al listar las categorias", error });
        }
    }
}

export default categoriaController;