/*const express = require("express");
const cors = require("cors");
const contentRoutes = require("./routes/contenidorutas");
const db = require("./database/");

const path = require("path");
const app = express();

app.use(express.json());
app.use(cors());

let contenidos = [];
let id = 1;

// Obtener todos los contenidos
app.get("/contenidos", (req, res) => {
  res.json(contenidos);
});

// Agregar un nuevo contenido
app.post("/contenidos", (req, res) => {
  const nuevoContenido = { id: id++, ...req.body };
  contenidos.push(nuevoContenido);
  res.json(nuevoContenido);
});

// Editar un contenido
app.put("/contenidos/:id", (req, res) => {
  const { id } = req.params;
  const index = contenidos.findIndex((c) => c.id == id);
  if (index !== -1) {
    contenidos[index] = { id: parseInt(id), ...req.body };
    res.json(contenidos[index]);
  } else {
    res.status(404).send("Contenido no encontrado");
  }
});

// Eliminar un contenido
app.delete("/contenidos/:id", (req, res) => {
  contenidos = contenidos.filter((c) => c.id != req.params.id);
  res.sendStatus(204);
});

// Iniciar servidor
app.listen(5000, () => {
  console.log("Servidor corriendo en http://localhost:5000");
});


// Servir archivos estáticos de React
app.use(express.static(path.join(__dirname, "../client/public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/public", "index.html"));
});


app.use(cors());
app.use(express.json());

// Conectar las rutas de contenido
app.use("/api/content", contentRoutes);
*/

//Comentado para tenerlo de respaldo
/*
const express = require("express");
const cors = require("cors");
const destinoRoutes = require("./routes/destinorutas");
const db = require("../../database/database.js");

const app = express();
app.use(cors());
app.use(express.json());

// Conectar rutas de destinos turísticos
app.use("/api/destinos", destinoRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
*/
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const db = require('./database'); // Conexión a MySQL

// Cargar variables de entorno desde .env
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rutas
const registroRoutes = require('./routes/registro_conexion');
app.use('/api', registroRoutes);

const loginRoute = require('./routes/login');
app.use('/login', loginRoute);


// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Servidor funcionando correctamente 🚀');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
