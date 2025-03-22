const db = require("../configuration/basededatos");

const Destino = {
    insertar: (datos, callback) => {
        const { id_categoria, nombre, descripcion, ciudad, direccion } = datos;
        db.query(
            "CALL insertar_destino(?, ?, ?, ?, ?)",
            [id_categoria, nombre, descripcion, ciudad, direccion],
            callback
        );
    },

    consultarPorId: (id, callback) => {
        db.query("CALL consultar_destino_id(?)", [id], callback);
    },

    consultarTodos: (callback) => {
        db.query("CALL consultar_destinos()", callback);
    },

    actualizar: (id, datos, callback) => {
        const { id_categoria, nombre, descripcion, ciudad, direccion } = datos;
        db.query(
            "CALL actualizar_destino(?, ?, ?, ?, ?, ?)",
            [id, id_categoria, nombre, descripcion, ciudad, direccion],
            callback
        );
    },

    eliminar: (id, callback) => {
        db.query("CALL eliminar_destino(?)", [id], callback);
    }
};

module.exports = Destino;
