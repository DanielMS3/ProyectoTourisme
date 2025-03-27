const express = require('express');
const app = express();
const path = require('path');
const registroRouter = require('./server/routes/registro_conexion');

// Middleware para archivos estáticos (sirve `index.html` desde `client/`)
app.use(express.static(path.join(__dirname, 'client')));

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/api/registro', registroRouter);

// Ruta para el index.html por defecto
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
