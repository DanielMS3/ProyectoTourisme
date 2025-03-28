const jwt = require("jsonwebtoken");

app.get("/perfil", (req, res) => {
    const authHeader = req.headers["authorization"];
    
    if (!authHeader) {
        return res.status(401).json({ error: "No autorizado" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, "clave_secreta", (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Token inválido" });
        }

        res.json({ user: { email: decoded.email } });
    });
});
