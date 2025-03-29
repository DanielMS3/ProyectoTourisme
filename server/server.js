const express = require('express');
const connection = require('./database/database'); // Conexión a la base de datos
const app = express();

// Middleware para servir archivos estáticos (si tienes un frontend en 'public')
app.use(express.static('public'));

// Ruta principal para verificar que el servidor está funcionando
app.get('/', (req, res) => {
  res.send('<h1>Bienvenido a Tourisme</h1><p>El servidor está funcionando correctamente.</p>');
});

// Ruta de prueba de conexión a la base de datos
app.get('/test-db', (req, res) => {
  connection.query('SELECT 1 + 1 AS result', (err, results) => {
    if (err) {
      console.error('Error ejecutando la consulta:', err);
      return res.status(500).json({ error: 'Error en la base de datos' });
    }
    res.json({ message: 'Conexión exitosa', result: results[0].result });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en: http://localhost:${PORT}`);
});
