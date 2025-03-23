const express = require('express');
const bodyParser = require('body-parser');
const generalCrud = require('./general_crud');
const path = require('path'); // Importa el modulo path.

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname)); // Sirve archivos estáticos (HTML, JS, CSS)

app.get('/', (req, res) => { // Agrega esta ruta
    res.sendFile(path.join(__dirname, 'general_crud.html'));
});

app.post('/insertarUsuario', (req, res) => {
    const { nombre, correo, fecha_nacimiento, genero, nacionalidad, contrasena_hash, id_google, id_rol } = req.body;
    generalCrud.insertarUsuario(nombre, correo, fecha_nacimiento, genero, nacionalidad, contrasena_hash, id_google, id_rol, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al insertar usuario' });
        }
        res.json(results);
    });
});

app.get('/consultarUsuarioPorId/:id', (req, res) => {
    const id = req.params.id;
    generalCrud.consultarUsuarioPorId(id, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al consultar usuario' });
        }
        res.json(results);
    });
});

app.get('/consultarUsuarios', (req, res) => {
    generalCrud.consultarUsuarios((err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al consultar usuarios' });
        }
        res.json(results);
    });
});

app.put('/actualizarUsuario', (req, res) => {
    const { id_usuario, nombre, correo, fecha_nacimiento, genero, nacionalidad, contrasena_hash, id_google, id_rol } = req.body;
    generalCrud.actualizarUsuario(id_usuario, nombre, correo, fecha_nacimiento, genero, nacionalidad, contrasena_hash, id_google, id_rol, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al actualizar usuario' });
        }
        res.json(results);
    });
});

app.delete('/eliminarUsuario/:id', (req, res) => {
    const id = req.params.id;
    generalCrud.eliminarUsuario(id, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al eliminar usuario' });
        }
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});