const express = require('express');
const connection = require('./server/database/database'); // Importar la conexión
const app = express();

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
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
