const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database/database');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'CRUD')));

//get
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'CRUD', 'general_crud.html'));
});

// --- Rutas para Calificaciones ---
app.get('/api/calificaciones', (req, res) => {
    db.query('CALL consultar_todas_calificaciones()', (err, results) => {
        if (err) {
            console.error('Error fetching calificaciones:', err);
            res.status(500).json({ error: 'Failed to fetch calificaciones' });
            return;
        }
        res.json(results[0]);
    });
});

app.get('/api/calificaciones/:id', (req, res) => {
    const calificacionId = req.params.id;
    db.query('CALL consultar_calificacion_id(?)', [calificacionId], (err, results) => {
        if (err) {
            console.error('Error fetching calificacion:', err);
            res.status(500).json({ error: 'Failed to fetch calificacion' });
            return;
        }
        if (results[0].length > 0) {
            res.json(results[0][0]);
        } else {
            res.status(404).json({ message: 'Calificacion not found' });
        }
    });
});

app.post('/api/calificaciones', (req, res) => {
    const { id_usuario, id_destino, calificacion, comentario } = req.body;
    db.query('CALL insertar_calificacion_destino(?, ?, ?, ?)', [id_usuario, id_destino, calificacion, comentario], (err, results) => {
        if (err) {
            console.error('Error creating calificacion:', err);
            res.status(500).json({ error: 'Failed to create calificacion' });
            return;
        }
        res.status(201).json({ message: 'Calificacion created successfully' });
    });
});

app.put('/api/calificaciones/:id', (req, res) => {
    const calificacionId = req.params.id;
    const { calificacion, comentario } = req.body;
    db.query('CALL actualizar_calificacion(?, ?, ?)', [calificacionId, calificacion, comentario], (err, results) => {
        if (err) {
            console.error('Error updating calificacion:', err);
            res.status(500).json({ error: 'Failed to update calificacion' });
            return;
        }
        if (results.affectedRows > 0) {
            res.json({ message: 'Calificacion updated successfully' });
        } else {
            res.status(404).json({ message: 'Calificacion not found' });
        }
    });
});

app.delete('/api/calificaciones/:id', (req, res) => {
    const calificacionId = req.params.id;
    db.query('CALL eliminar_calificacion(?)', [calificacionId], (err, results) => {
        if (err) {
            console.error('Error deleting calificacion:', err);
            res.status(500).json({ error: 'Failed to delete calificacion' });
            return;
        }
        if (results.affectedRows > 0) {
            res.json({ message: 'Calificacion deleted successfully' });
        } else {
            res.status(404).json({ message: 'Calificacion not found' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});