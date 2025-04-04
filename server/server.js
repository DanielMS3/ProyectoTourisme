// Cargar variables de entorno
require('dotenv').config();

// Importar módulos necesarios
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const db = require('./database/database'); // Importar conexión a la BD

// Inicializar la app
const app = express();

// Middlewares
app.use(cors()); // Permitir solicitudes desde el frontend (React)
app.use(express.json()); // Soporte para JSON en las solicitudes
app.use(morgan('dev')); // Registro de solicitudes en consola

// Ruta de prueba para verificar la conexión con la BD
app.get('/api/test', async (req, res) => {
  try {
    const [result] = await db.query("SELECT 'Conexión exitosa' AS mensaje");
    res.json({ mensaje: result[0].mensaje });
  } catch (error) {
    res.status(500).json({ error: 'Error en la conexión a la base de datos' });
  }
});

// Servir el frontend en producción
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Definir puerto del servidor
const PORT = process.env.PORT || 3000;

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

