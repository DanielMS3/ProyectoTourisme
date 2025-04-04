const express = require("express");
const router = express.Router();
const db = require("../database/database");

// Ruta para agregar una calificación
router.post("/", (req, res) => {
    const { usuario_id, tarjeta_id, calificacion } = req.body;

    if (!usuario_id || !tarjeta_id || !calificacion) {
        return res.status(400).json({ error: "Faltan datos requeridos" });
    }

    const query = "INSERT INTO calificaciones (usuario_id, tarjeta_id, calificacion) VALUES (?, ?, ?)";

    db.query(query, [usuario_id, tarjeta_id, calificacion], (error, results) => {
        if (error) {
            console.error("Error al insertar calificación:", error);
            return res.status(500).json({ error: "Error al guardar la calificación" });
        }

        res.status(201).json({ mensaje: "Calificación guardada exitosamente", id: results.insertId });
    });
});

module.exports = router;
