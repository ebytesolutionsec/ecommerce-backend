import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './app/helper/swagger.js';

import routerUsuario from './app/routers/usuario/usuario.router.js';
import routerAuth from './app/routers/usuario/auth.router.js';
import routerCategoria from './app/routers/categoria/categoria.router.js';
import routerProducto from './app/routers/producto/producto.router.js';



dotenv.config();

const app = express();

//Configure Files from ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Conexión BD
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Conectado a la base de datos'))
  .catch(err => console.log("Error al conectar a Mongo DB", err));



// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// CORS
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
}));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(`/api/v1`, routerUsuario)
app.use(`/api/v1`, routerCategoria)
app.use(`/api/v1`, routerProducto)
app.use(`/api/v1`, routerAuth)

/**
 * Servir imagenes y archivos
*/
app.use('/uploads/productos', express.static('uploads'));


export default app;