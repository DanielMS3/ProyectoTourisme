// Importar el módulo de conexión a la base de datos
const pool = require("../database/database")
const express = require("express")
const router = express.Router()

// Obtener todas las empresas
router.get("/api/empresas", async (req, res) => {
  try {
    console.log("Obteniendo empresas...")
    const [rows] = await pool.query(`
      SELECT e.id_empresa, e.nombre, e.descripcion, e.tipo, 
             DATE_FORMAT(e.horario_apertura, '%H:%i') as horario_apertura,
             DATE_FORMAT(e.horario_cierre, '%H:%i') as horario_cierre,
             e.telefono, e.id_usuario, e.id_destino,
             u.nombre as usuario_nombre,
             d.nombre as destino_nombre
      FROM empresa e
      JOIN usuario u ON e.id_usuario = u.id_usuario
      JOIN destino_turistico d ON e.id_destino = d.id_destino
      ORDER BY e.id_empresa
    `)

    console.log("Empresas obtenidas:", rows.length)
    res.json(rows)
  } catch (error) {
    console.error("Error al obtener empresas:", error)
    res.status(500).json({ error: "Error al obtener empresas" })
  }
})

// Obtener todos los usuarios para el selector
router.get("/api/usuarios-select", async (req, res) => {
  try {
    console.log("Obteniendo usuarios para selector...")
    const [rows] = await pool.query(`
      SELECT id_usuario, nombre
      FROM usuario
      ORDER BY nombre
    `)

    console.log("Usuarios obtenidos para selector:", rows.length)
    res.json(rows)
  } catch (error) {
    console.error("Error al obtener usuarios para selector:", error)
    res.status(500).json({ error: "Error al obtener usuarios" })
  }
})

// Obtener todos los destinos para el selector
router.get("/api/destinos-select", async (req, res) => {
  try {
    console.log("Obteniendo destinos para selector...")
    const [rows] = await pool.query(`
      SELECT id_destino, nombre
      FROM destino_turistico
      ORDER BY nombre
    `)

    console.log("Destinos obtenidos para selector:", rows.length)
    res.json(rows)
  } catch (error) {
    console.error("Error al obtener destinos para selector:", error)
    res.status(500).json({ error: "Error al obtener destinos" })
  }
})

// Añadir una nueva empresa
router.post("/api/empresas", async (req, res) => {
  try {
    const { nombre, descripcion, tipo, horario_apertura, horario_cierre, telefono, id_usuario, id_destino } = req.body

    if (!nombre || !tipo || !id_usuario || !id_destino) {
      return res.status(400).json({
        error: "Los campos nombre, tipo, usuario y destino son requeridos",
      })
    }

    console.log("Añadiendo empresa:", {
      nombre,
      descripcion,
      tipo,
      horario_apertura,
      horario_cierre,
      telefono,
      id_usuario,
      id_destino,
    })

    const [result] = await pool.query(
      `INSERT INTO empresa 
       (nombre, descripcion, tipo, horario_apertura, horario_cierre, telefono, id_usuario, id_destino) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre,
        descripcion || "",
        tipo,
        horario_apertura || null,
        horario_cierre || null,
        telefono || "",
        id_usuario,
        id_destino,
      ],
    )

    console.log("Empresa añadida con ID:", result.insertId)

    // Obtener los nombres de usuario y destino
    const [usuarioRow] = await pool.query("SELECT nombre FROM usuario WHERE id_usuario = ?", [id_usuario])

    const [destinoRow] = await pool.query("SELECT nombre FROM destino_turistico WHERE id_destino = ?", [id_destino])

    const usuario_nombre = usuarioRow.length > 0 ? usuarioRow[0].nombre : ""
    const destino_nombre = destinoRow.length > 0 ? destinoRow[0].nombre : ""

    res.status(201).json({
      success: true,
      message: "Empresa añadida correctamente",
      id_empresa: result.insertId,
      nombre,
      descripcion: descripcion || "",
      tipo,
      horario_apertura: horario_apertura || null,
      horario_cierre: horario_cierre || null,
      telefono: telefono || "",
      id_usuario,
      id_destino,
      usuario_nombre,
      destino_nombre,
    })
  } catch (error) {
    console.error("Error al añadir empresa:", error)

    // Verificar si es un error de duplicado (nombre único)
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Ya existe una empresa con ese nombre" })
    }

    res.status(500).json({ error: "Error al añadir empresa" })
  }
})

// Actualizar una empresa existente
router.put("/api/empresas/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, descripcion, tipo, horario_apertura, horario_cierre, telefono, id_usuario, id_destino } = req.body

    if (!nombre || !tipo || !id_usuario || !id_destino) {
      return res.status(400).json({
        error: "Los campos nombre, tipo, usuario y destino son requeridos",
      })
    }

    console.log("Actualizando empresa:", {
      id,
      nombre,
      descripcion,
      tipo,
      horario_apertura,
      horario_cierre,
      telefono,
      id_usuario,
      id_destino,
    })

    const [result] = await pool.query(
      `UPDATE empresa 
       SET nombre = ?, descripcion = ?, tipo = ?, 
           horario_apertura = ?, horario_cierre = ?, 
           telefono = ?, id_usuario = ?, id_destino = ? 
       WHERE id_empresa = ?`,
      [
        nombre,
        descripcion || "",
        tipo,
        horario_apertura || null,
        horario_cierre || null,
        telefono || "",
        id_usuario,
        id_destino,
        id,
      ],
    )

    if (result.affectedRows === 0) {
      console.log("Empresa no encontrada para actualizar")
      return res.status(404).json({ error: "Empresa no encontrada" })
    }

    console.log("Empresa actualizada correctamente")

    res.json({
      success: true,
      message: "Empresa actualizada correctamente",
    })
  } catch (error) {
    console.error("Error al actualizar empresa:", error)

    // Verificar si es un error de duplicado (nombre único)
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Ya existe una empresa con ese nombre" })
    }

    res.status(500).json({ error: "Error al actualizar empresa" })
  }
})

// Eliminar una empresa
router.delete("/api/empresas/:id", async (req, res) => {
  try {
    const { id } = req.params

    console.log("Eliminando empresa:", id)

    const [result] = await pool.query("DELETE FROM empresa WHERE id_empresa = ?", [id])

    if (result.affectedRows === 0) {
      console.log("Empresa no encontrada para eliminar")
      return res.status(404).json({ error: "Empresa no encontrada" })
    }

    console.log("Empresa eliminada correctamente")

    res.json({
      success: true,
      message: "Empresa eliminada correctamente",
    })
  } catch (error) {
    console.error("Error al eliminar empresa:", error)
    res.status(500).json({ error: "Error al eliminar empresa" })
  }
})

module.exports = router

