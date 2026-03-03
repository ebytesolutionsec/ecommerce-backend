import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './app/helper/swagger.js';
import socket from "./app/helper/socket.io.js"
import http from "http"

import routerUsuario from './app/routers/usuario/usuario.router.js';
import routerAuth from './app/routers/usuario/auth.router.js';
import routerCategoria from './app/routers/categoria/categoria.router.js';
import routerProducto from './app/routers/producto/producto.router.js';
import routerOrders from './app/routers/orders/orders.router.js';
import routerPayment from './app/routers/payment/payment.router.js';
import routerPayMethod from './app/routers/paymethod/paymethod.router.js';
import routerPayphone from './app/routers/payphone/payphone.controller.js';



dotenv.config();

const app = express();
const server = http.createServer(app)

socket.init(server)

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
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
}));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(`/api/v1`, routerUsuario)
app.use(`/api/v1`, routerCategoria)
app.use(`/api/v1`, routerProducto)
app.use('/api/v1', routerOrders)
app.use('/api/v1', routerPayment)
app.use('/api/v1', routerPayMethod)
app.use(`/api/v1`, routerAuth)
app.use(`/api/v1`, routerPayphone)

/**
 * Servir imagenes y archivos
*/
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));


export default app;