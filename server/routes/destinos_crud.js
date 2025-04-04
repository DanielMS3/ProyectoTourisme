// Importar el módulo de conexión a la base de datos
const pool = require("../database/database");
const express = require("express");
const router = express.Router();

// Obtener todos los destinos
router.get('/api/destinos', async (req, res) => {
  try {
    console.log('Obteniendo destinos...');
    const [rows] = await pool.query(`
      SELECT d.id_destino, d.nombre, d.descripcion, d.ciudad, d.direccion, d.id_categoria, 
             c.nombre as categoria_nombre
      FROM destino_turistico d
      JOIN categoria_turistica c ON d.id_categoria = c.id_categoria
      ORDER BY d.id_destino
    `);
    
    console.log('Destinos obtenidos:', rows.length);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener destinos:', error);
    res.status(500).json({ error: 'Error al obtener destinos' });
  }
});

// Obtener todas las categorías para el selector
router.get('/api/categorias-select', async (req, res) => {
  try {
    console.log('Obteniendo categorías para selector...');
    const [rows] = await pool.query(`
      SELECT id_categoria, nombre
      FROM categoria_turistica
      ORDER BY nombre
    `);
    
    console.log('Categorías obtenidas para selector:', rows.length);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener categorías para selector:', error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

// Añadir un nuevo destino
router.post('/api/destinos', async (req, res) => {
  try {
    const { nombre, descripcion, ciudad, direccion, id_categoria } = req.body;
    
    if (!nombre || !ciudad || !direccion || !id_categoria) {
      return res.status(400).json({ 
        error: 'Los campos nombre, ciudad, dirección y categoría son requeridos' 
      });
    }
    
    console.log('Añadiendo destino:', { nombre, descripcion, ciudad, direccion, id_categoria });
    
    const [result] = await pool.query(
      'INSERT INTO destino_turistico (nombre, descripcion, ciudad, direccion, id_categoria) VALUES (?, ?, ?, ?, ?)',
      [nombre, descripcion || '', ciudad, direccion, id_categoria]
    );
    
    console.log('Destino añadido con ID:', result.insertId);
    
    // Obtener el nombre de la categoría
    const [categoriaRows] = await pool.query(
      'SELECT nombre FROM categoria_turistica WHERE id_categoria = ?',
      [id_categoria]
    );
    
    const categoria_nombre = categoriaRows.length > 0 ? categoriaRows[0].nombre : '';
    
    res.status(201).json({
      success: true,
      message: 'Destino añadido correctamente',
      id_destino: result.insertId,
      nombre,
      descripcion: descripcion || '',
      ciudad,
      direccion,
      id_categoria,
      categoria_nombre
    });
  } catch (error) {
    console.error('Error al añadir destino:', error);
    
    // Verificar si es un error de duplicado (nombre único)
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Ya existe un destino con ese nombre' });
    }
    
    res.status(500).json({ error: 'Error al añadir destino' });
  }
});

// Actualizar un destino existente
router.put('/api/destinos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, ciudad, direccion, id_categoria } = req.body;
    
    if (!nombre || !ciudad || !direccion || !id_categoria) {
      return res.status(400).json({ 
        error: 'Los campos nombre, ciudad, dirección y categoría son requeridos' 
      });
    }
    
    console.log('Actualizando destino:', { id, nombre, descripcion, ciudad, direccion, id_categoria });
    
    const [result] = await pool.query(
      'UPDATE destino_turistico SET nombre = ?, descripcion = ?, ciudad = ?, direccion = ?, id_categoria = ? WHERE id_destino = ?',
      [nombre, descripcion || '', ciudad, direccion, id_categoria, id]
    );
    
    if (result.affectedRows === 0) {
      console.log('Destino no encontrado para actualizar');
      return res.status(404).json({ error: 'Destino no encontrado' });
    }
    
    console.log('Destino actualizado correctamente');
    
    res.json({
      success: true,
      message: 'Destino actualizado correctamente'
    });
  } catch (error) {
    console.error('Error al actualizar destino:', error);
    
    // Verificar si es un error de duplicado (nombre único)
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Ya existe un destino con ese nombre' });
    }
    
    res.status(500).json({ error: 'Error al actualizar destino' });
  }
});

// Eliminar un destino
router.delete('/api/destinos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('Eliminando destino:', id);
    
    const [result] = await pool.query(
      'DELETE FROM destino_turistico WHERE id_destino = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      console.log('Destino no encontrado para eliminar');
      return res.status(404).json({ error: 'Destino no encontrado' });
    }
    
    console.log('Destino eliminado correctamente');
    
    res.json({
      success: true,
      message: 'Destino eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar destino:', error);
    res.status(500).json({ error: 'Error al eliminar destino' });
  }
});

module.exports = router;

