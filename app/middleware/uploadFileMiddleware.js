import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Filtro de archivos
const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|webp/;
    const extname = fileTypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    const mimeType = fileTypes.test(file.mimetype);

    if (extname && mimeType) {
        cb(null, true);
    } else {
        cb(new Error('Archivo no permitido'));
    }
};

// Función reutilizable
const createUploader = (folderPath) => {

    const uploadDir = path.join(process.cwd(), folderPath);

    // Crear carpeta si no existe
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    });

    return multer({
        storage,
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter
    });
};

// Exportaciones dinámicas
export const uploadSingle = (folderPath, fieldName) =>
    createUploader(folderPath).single(fieldName);

export const uploadMultiple = (folderPath, fieldName, max = 5) =>
    createUploader(folderPath).array(fieldName, max);