// Cargar las variables de entorno
require('dotenv').config();

// Importar mysql2
const mysql = require('mysql2');

// Configurar SSL correctamente
const sslConfig = process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : false;

// Crear un pool de conexión a la base de datos
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: sslConfig,
  waitForConnections: true, // Permite reutilizar conexiones en espera
  connectionLimit: 10, // Define el máximo de conexiones simultáneas
  queueLimit: 0, // Cola ilimitada de peticiones
}).promise();

// Probar la conexión
(async () => {
  try {
    const [rows] = await pool.query("SELECT 1");
    console.log("✅ Conexión exitosa a la base de datos MySQL en Azure");
  } catch (error) {
    console.error("❌ Error conectando a la base de datos:", error.message);
    process.exit(1); // Finaliza el proceso si la conexión falla
  }
})();

// Cerrar conexiones al apagar el servidor
process.on("SIGINT", async () => {
  console.log("\n🛑 Cerrando conexiones de la base de datos...");
  await pool.end();
  console.log("✅ Conexiones cerradas correctamente.");
  process.exit(0);
});

module.exports = pool;