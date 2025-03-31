const dotenv = require("dotenv");
dotenv.config(); 

// Importa la configuración del servidor
const app = require("./server/server"); 

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});