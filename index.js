require('dotenv').config();
const express = require('express');
const db = require('./database/database'); // importa la conexión a la db

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Servidor funcionando correctamente');
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});