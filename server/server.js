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
require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuración de la base de datos
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error("Error de conexión a la base de datos:", err);
        return;
    }
    console.log("Conectado a MySQL");
});

// 🔹 Ruta para REGISTRAR usuario sin avatar
app.post("/register", async (req, res) => {
    const { nombreCompleto, email, fechaNacimiento, genero, nacionalidad, password } = req.body;

    if (!nombreCompleto || !email || !fechaNacimiento || !genero || !password) {
        return res.status(400).send({ msg: "Todos los campos obligatorios deben ser llenados" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `INSERT INTO usuarios (nombre, email, fecha_nacimiento, genero, nacionalidad, password) 
                     VALUES (?, ?, ?, ?, ?, ?)`;

        db.query(sql, [nombreCompleto, email, fechaNacimiento, genero, nacionalidad, hashedPassword], (err, result) => {
            if (err) {
                console.error("Error en el registro:", err);
                return res.status(500).send({ msg: "Error en el registro", error: err });
            }
            res.send({ msg: "Usuario registrado con éxito", id: result.insertId });
        });
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).send({ msg: "Error en el servidor" });
    }
});

// Iniciar el servidor
app.listen(3000, () => console.log("Servidor corriendo en http://localhost:3000"));
