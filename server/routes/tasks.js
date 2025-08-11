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
 *     Task:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, in_progress, completed]
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Obtener todas las tareas
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: Lista de tareas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
router.get('/', (req, res) => {
  // BUG INTENCIONAL: No hay paginación, podría causar problemas con muchas tareas
  const query = 'SELECT * FROM tasks ORDER BY created_at DESC';
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al obtener tareas' });
    }
    res.json(rows);
  });
});

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Obtener una tarea por ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tarea encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Tarea no encontrada
 */
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  // BUG INTENCIONAL: No hay validación de entrada, vulnerable a SQL injection
  const query = `SELECT * FROM tasks WHERE id = ${id}`;
  
  db.get(query, [], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al obtener la tarea' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    res.json(row);
  });
});

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Crear una nueva tarea
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *     responses:
 *       201:
 *         description: Tarea creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 */
router.post('/', (req, res) => {
  const { title, description, priority = 'medium' } = req.body;
  
  // BUG INTENCIONAL: Validación muy básica, no valida longitud ni caracteres especiales
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'El título es requerido' });
  }
  
  const query = 'INSERT INTO tasks (title, description, priority) VALUES (?, ?, ?)';
  const params = [title, description, priority];
  
  db.run(query, params, function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al crear la tarea' });
    }
    
    // Obtener la tarea creada
    db.get('SELECT * FROM tasks WHERE id = ?', [this.lastID], (err, row) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error al obtener la tarea creada' });
      }
      res.status(201).json(row);
    });
  });
});

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Actualizar una tarea
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: Tarea actualizada exitosamente
 *       404:
 *         description: Tarea no encontrada
 */
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority } = req.body;
  
  // BUG INTENCIONAL: No valida que la tarea exista antes de actualizar
  const query = 'UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
  const params = [title, description, status, priority, id];
  
  db.run(query, params, function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al actualizar la tarea' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    
    res.json({ message: 'Tarea actualizada exitosamente' });
  });
});

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Eliminar una tarea
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tarea eliminada exitosamente
 *       404:
 *         description: Tarea no encontrada
 */
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  const query = 'DELETE FROM tasks WHERE id = ?';
  
  db.run(query, [id], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al eliminar la tarea' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    
    res.json({ message: 'Tarea eliminada exitosamente' });
  });
});

module.exports = router; 