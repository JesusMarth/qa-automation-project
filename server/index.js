const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Manager API',
      version: '1.0.0',
      description: 'API para gestión de tareas con bugs intencionales para testing'
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Servidor de desarrollo'
      }
    ]
  },
  apis: ['./routes/*.js']
};

const specs = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// BUG INTENCIONAL #1: Rate limiting muy permisivo (debería ser más restrictivo)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1000, // BUG: Demasiado permisivo, debería ser 100
  message: 'Demasiadas solicitudes desde esta IP'
});
app.use('/api/', limiter);

// Inicializar base de datos
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// BUG INTENCIONAL #2: No hay validación de entrada en la creación de tablas
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    priority TEXT DEFAULT 'medium',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  
  // BUG INTENCIONAL #3: Tabla de usuarios sin encriptación de contraseñas
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Rutas de la API
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/users', require('./routes/users'));

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// BUG INTENCIONAL #4: Manejo de errores global muy básico
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' }); // BUG: No debería exponer detalles internos
});

// BUG INTENCIONAL #5: Puerto hardcodeado en lugar de usar variable de entorno
app.listen(3001, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
  console.log(`Documentación disponible en: http://localhost:${PORT}/api-docs`);
});

module.exports = app; 