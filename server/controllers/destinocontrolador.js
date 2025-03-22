const Destino = require("../models/destinomodelo");

exports.insertarDestino = (req, res) => {
    Destino.insertar(req.body, (err, resultado) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: "Destino agregado correctamente" });
    });
};

exports.consultarDestinoPorId = (req, res) => {
    Destino.consultarPorId(req.params.id, (err, resultados) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(resultados[0]);
    });
};

exports.consultarDestinos = (req, res) => {
    Destino.consultarTodos((err, resultados) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(resultados[0]);
    });
};

exports.actualizarDestino = (req, res) => {
    Destino.actualizar(req.params.id, req.body, (err, resultado) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: "Destino actualizado correctamente" });
    });
};

exports.eliminarDestino = (req, res) => {
    Destino.eliminar(req.params.id, (err, resultado) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: "Destino eliminado correctamente" });
    });
};
