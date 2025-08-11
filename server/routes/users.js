const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new sqlite3.Database(dbPath);

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - email
 *       properties:
 *         id:
 *           type: integer
 *         username:
 *           type: string
 *         password:
 *           type: string
 *         email:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post('/', (req, res) => {
  const { username, password, email } = req.body;
  
  // BUG INTENCIONAL: Validación muy básica, no valida formato de email ni fortaleza de contraseña
  if (!username || !password || !email) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }
  
  // BUG INTENCIONAL: No hay validación de formato de email
  if (!email.includes('@')) {
    return res.status(400).json({ error: 'Formato de email inválido' });
  }
  
  // BUG INTENCIONAL: No hay validación de longitud mínima de contraseña
  if (password.length < 3) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 3 caracteres' });
  }
  
  const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
  const params = [username, password, email]; // BUG: Contraseña en texto plano
  
  db.run(query, params, function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ error: 'El usuario o email ya existe' });
      }
      console.error(err);
      return res.status(500).json({ error: 'Error al crear el usuario' });
    }
    
    // Obtener el usuario creado (sin contraseña)
    db.get('SELECT id, username, email, created_at FROM users WHERE id = ?', [this.lastID], (err, row) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error al obtener el usuario creado' });
      }
      res.status(201).json(row);
    });
  });
});

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
  }
  
  // BUG INTENCIONAL: Consulta vulnerable a SQL injection
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  
  db.get(query, [], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error en el login' });
    }
    
    if (!row) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    // BUG INTENCIONAL: Devuelve información sensible del usuario
    res.json({
      message: 'Login exitoso',
      user: {
        id: row.id,
        username: row.username,
        email: row.email,
        password: row.password // BUG: No debería devolver la contraseña
      }
    });
  });
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/', (req, res) => {
  // BUG INTENCIONAL: No hay autenticación, cualquiera puede ver todos los usuarios
  const query = 'SELECT * FROM users';
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al obtener usuarios' });
    }
    
    // BUG INTENCIONAL: Devuelve contraseñas en texto plano
    res.json(rows);
  });
});

module.exports = router; 