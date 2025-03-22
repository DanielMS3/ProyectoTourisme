const express = require("express");
const router = express.Router();
const destinoControlador = require("../controllers/destinocontrolador");

router.post("/", destinoControlador.insertarDestino);
router.get("/:id", destinoControlador.consultarDestinoPorId);
router.get("/", destinoControlador.consultarDestinos);
router.put("/:id", destinoControlador.actualizarDestino);
router.delete("/:id", destinoControlador.eliminarDestino);

module.exports = router;
