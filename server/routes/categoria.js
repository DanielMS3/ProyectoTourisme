// Importar el módulo de conexión a la base de datos
const pool = require("../database/database")
const express = require("express")
const router = express.Router()

// Ruta para depuración - muestra que las rutas están funcionando
router.get("/api/test", (req, res) => {
  res.json({ message: "API funcionando correctamente" })
})

// Modificar la consulta SQL para obtener categorías sin contar destinos asociados
router.get("/api/categories", async (req, res) => {
  try {
    console.log("Obteniendo categorías...")
    const [rows] = await pool.query(`
      SELECT c.id_categoria, c.nombre, c.descripcion
      FROM categoria_turistica c 
      ORDER BY c.id_categoria
    `)

    console.log("Categorías obtenidas:", rows.length)
    res.json(rows)
  } catch (error) {
    console.error("Error al obtener categorías:", error)
    res.status(500).json({ error: "Error al obtener categorías" })
  }
})

// Modificar la respuesta de añadir categoría para no incluir destinos_asociados
router.post("/api/categories", async (req, res) => {
  try {
    const { nombre, descripcion } = req.body

    if (!nombre || !descripcion) {
      return res.status(400).json({ error: "Nombre y descripción son requeridos" })
    }

    console.log("Añadiendo categoría:", { nombre, descripcion })

    const [result] = await pool.query("INSERT INTO categoria_turistica (nombre, descripcion) VALUES (?, ?)", [
      nombre,
      descripcion,
    ])

    console.log("Categoría añadida con ID:", result.insertId)

    res.status(201).json({
      success: true,
      message: "Categoría añadida correctamente",
      id_categoria: result.insertId,
      nombre,
      descripcion,
    })
  } catch (error) {
    console.error("Error al añadir categoría:", error)

    // Verificar si es un error de duplicado (nombre único)
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Ya existe una categoría con ese nombre" })
    }

    res.status(500).json({ error: "Error al añadir categoría" })
  }
})

// Actualizar una categoría existente
router.put("/api/categories/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, descripcion } = req.body

    if (!nombre || !descripcion) {
      return res.status(400).json({ error: "Nombre y descripción son requeridos" })
    }

    console.log("Actualizando categoría:", { id, nombre, descripcion })

    const [result] = await pool.query(
      "UPDATE categoria_turistica SET nombre = ?, descripcion = ? WHERE id_categoria = ?",
      [nombre, descripcion, id],
    )

    if (result.affectedRows === 0) {
      console.log("Categoría no encontrada para actualizar")
      return res.status(404).json({ error: "Categoría no encontrada" })
    }

    console.log("Categoría actualizada correctamente")

    res.json({
      success: true,
      message: "Categoría actualizada correctamente",
    })
  } catch (error) {
    console.error("Error al actualizar categoría:", error)

    // Verificar si es un error de duplicado (nombre único)
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Ya existe una categoría con ese nombre" })
    }

    res.status(500).json({ error: "Error al actualizar categoría" })
  }
})

// Modificar la función de eliminar categoría para no verificar destinos asociados
router.delete("/api/categories/:id", async (req, res) => {
  try {
    const { id } = req.params

    console.log("Eliminando categoría:", id)

    const [result] = await pool.query("DELETE FROM categoria_turistica WHERE id_categoria = ?", [id])

    if (result.affectedRows === 0) {
      console.log("Categoría no encontrada para eliminar")
      return res.status(404).json({ error: "Categoría no encontrada" })
    }

    console.log("Categoría eliminada correctamente")

    res.json({
      success: true,
      message: "Categoría eliminada correctamente",
    })
  } catch (error) {
    console.error("Error al eliminar categoría:", error)

    // Si hay un error de clave foránea, significa que hay destinos asociados
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(400).json({
        error: "No se puede eliminar la categoría porque tiene destinos asociados",
      })
    }

    res.status(500).json({ error: "Error al eliminar categoría" })
  }
})

module.exports = router

