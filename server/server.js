require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const jwt = require("jsonwebtoken");
const expressListRoutes = require("express-list-routes");
const db = require("./database/database"); 

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "../client")));

// Importación de rutas
const registroRoutes = require("./routes/registro_conexion");
const loginRoute = require("./routes/login");
const recuperarContrasenaRoutes = require("./routes/recuperar_contrasena");

// Definir rutas
app.use("/api/registro", registroRoutes);
app.use("/login", loginRoute);
app.use("/api", recuperarContrasenaRoutes);

// Ruta protegida /perfil
app.get("/perfil", (req, res) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(401).json({ error: "No autorizado: No se proporcionó un token" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET || "clave_secreta", (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Token inválido o expirado" });
        }

        res.json({ user: { email: decoded.email } });
    });
});

// Mostrar rutas en consola
expressListRoutes(app);

module.exports = app;
