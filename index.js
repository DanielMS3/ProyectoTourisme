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

// --- Rutas para Tours ---
app.get('/api/tours', (req, res) => {
    db.query('CALL get_all_tours()', (err, results) => {
        if (err) {
            console.error('Error fetching tours:', err);
            res.status(500).json({ error: 'Failed to fetch tours' });
            return;
        }
        res.json(results[0]);
    });
});

app.get('/api/tours/:id', (req, res) => {
    const tourId = req.params.id;
    db.query('CALL get_tour(?)', [tourId], (err, results) => {
        if (err) {
            console.error('Error fetching tour:', err);
            res.status(500).json({ error: 'Failed to fetch tour' });
            return;
        }
        if (results[0].length > 0) {
            res.json(results[0][0]);
        } else {
            res.status(404).json({ message: 'Tour not found' });
        }
    });
});

app.post('/api/tours', (req, res) => {
    const { nombre, descripcion, precio } = req.body;
    db.query('CALL create_tour(?, ?, ?)', [nombre, descripcion, precio], (err, results) => {
        if (err) {
            console.error('Error creating tour:', err);
            res.status(500).json({ error: 'Failed to create tour' });
            return;
        }
        res.status(201).json({ id: results[0][0]['LAST_INSERT_ID()'], message: 'Tour created successfully' });
    });
});

app.put('/api/tours/:id', (req, res) => {
    const tourId = req.params.id;
    const { nombre, descripcion, precio } = req.body;
    db.query('CALL update_tour(?, ?, ?, ?)', [tourId, nombre, descripcion, precio], (err, results) => {
        if (err) {
            console.error('Error updating tour:', err);
            res.status(500).json({ error: 'Failed to update tour' });
            return;
        }
        if (results.affectedRows > 0) {
            res.json({ message: 'Tour updated successfully' });
        } else {
            res.status(404).json({ message: 'Tour not found' });
        }
    });
});

app.delete('/api/tours/:id', (req, res) => {
    const tourId = req.params.id;
    db.query('CALL delete_tour(?)', [tourId], (err, results) => {
        if (err) {
            console.error('Error deleting tour:', err);
            res.status(500).json({ error: 'Failed to delete tour' });
            return;
        }
        if (results.affectedRows > 0) {
            res.json({ message: 'Tour deleted successfully' });
        } else {
            res.status(404).json({ message: 'Tour not found' });
        }
    });
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