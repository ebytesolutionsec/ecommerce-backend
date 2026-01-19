import { Router } from "express";
import productoController from "../../controllers/producto/producto.controller.js"
import verifyToken from '../../middleware/auth.middleware.js'
import { uploadSingle } from "../../middleware/uploadFileMiddleware.js";


const routerProducto = Router()

/**
 * @swagger
 * /producto/create:
 *   post:
 *     summary: Crear un nuevo producto
 *     description: |
 *       Crea un nuevo producto en el sistema.
 *       Esta ruta requiere autenticación mediante token JWT.
 *       Se validan los campos obligatorios y se verifica que el SKU no esté duplicado.
 *     tags:
 *       - Productos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - sku
 *               - img_prod
 *               - descripcion
 *               - descripcion_corta
 *               - categoria
 *               - precio
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 example: Camiseta Deportiva
 *               sku:
 *                 type: string
 *                 example: CAM-001
 *               img_prod:
 *                 type: string
 *                 example: camiseta.png
 *               descripcion:
 *                 type: string
 *                 example: Camiseta deportiva de alta calidad
 *               descripcion_corta:
 *                 type: string
 *                 example: Camiseta deportiva
 *               categoria:
 *                 type: string
 *                 example: 694962bd13e9a7e639f02e12
 *               precio:
 *                 type: number
 *                 example: 25.99
 *               precio_descuento:
 *                 type: number
 *                 example: 19.99
 *               stock:
 *                 type: number
 *                 example: 50
 *               disponible:
 *                 type: boolean
 *                 example: true
 *               rating:
 *                 type: number
 *                 example: 4.5
 *               destacado:
 *                 type: boolean
 *                 example: true
 *               estado:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Producto creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Producto creado correctamente
 *                 data:
 *                   type: object
 *       400:
 *         description: Campos obligatorios faltantes
 *       409:
 *         description: Ya existe un producto con el SKU enviado
 *       500:
 *         description: Error interno del servidor
 */
routerProducto.post('/producto/create', verifyToken, uploadSingle, productoController.createProducto);

/**
 * @swagger
 * /producto/list:
 *   get:
 *     summary: Listar productos con paginación
 *     tags: [Productos]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de registros por página
 *     responses:
 *       200:
 *         description: Lista de categorias obtenida correctamente
 *         content:
 *           application/json:
 *       400:
 *         description: Parámetros de paginación inválidos
 *       500:
 *         description: Error interno del servidor
 */
routerProducto.get('/producto/list', verifyToken, productoController.listProducto);

/**
 * @swagger
 * /producto/list/public:
 *   get:
 *     summary: Listar producto con paginación publica
 *     tags: [Productos]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de registros por página
 *     responses:
 *       200:
 *         description: Lista de productos obtenida correctamente
 *         content:
 *           application/json:
 *       400:
 *         description: Parámetros de paginación inválidos
 *       500:
 *         description: Error interno del servidor
 */
routerProducto.get('/producto/list/public', productoController.listProducto);

/**
 * @swagger
 * /producto/info/public/{id}:
 *   patch:
 *     summary: Buscar información de un producto publica
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Correcto
 *       400:
 *         description: Producto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
routerProducto.get('/producto/info/public/:id', productoController.infoProducto)

/**
 * @swagger
 * /producto/search/public:
 *   get:
 *     summary: Buscar productos por query
 *     description: Buscar productos por query se envia asi '/search/public?q=', se puede buscar por nombre de producto y nombre de la categoria
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Correcto
 *       400:
 *         description: Producto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
routerProducto.get('/producto/search/public', productoController.searchProducto)



export default routerProducto;