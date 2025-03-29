const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const db = require("./server/database/database");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

const path = require("path");

app.use(express.static(path.join(__dirname, "client", "public")));


// Rutas
const registroRoutes = require("./server/routes/registro_conexion");
app.use("/api", registroRoutes);

const loginRoute = require("./server/routes/login");
app.use("/login", loginRoute);

const recuperacionRoute = require("./server/routes/recuperar_contrasena");
app.use("/recuperar_contrasena", recuperacionRoute);



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

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});