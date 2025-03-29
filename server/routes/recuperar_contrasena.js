const express = require('express');
const router = express.Router();
const db = require('../database/database');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

// Enviar código de verificación
router.post('/enviar-codigo', async (req, res) => {
    const { correo } = req.body;
    try {
        const [user] = await db.query('SELECT id_usuario FROM autenticacion WHERE correo = ?', [correo]);
        
        if (!user.length) {
            return res.status(404).json({ mensaje: 'Correo no registrado' });
        }

        const id_usuario = user[0].id_usuario;
        const token = crypto.randomInt(100000, 999999).toString(); // Código de 6 dígitos
        const fecha_expiracion = new Date(Date.now() + 5 * 60 * 1000); // Expira en 5 min
        
        await db.query('INSERT INTO Token_Recuperacion (id_usuario, token, fecha_expiracion) VALUES (?, ?, ?)',
            [id_usuario, token, fecha_expiracion]);

        // Configurar el transporte de correo
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: 'tuemail@gmail.com', pass: 'tupassword' }
        });
        
        const mailOptions = {
            from: 'tuemail@gmail.com',
            to: correo,
            subject: 'Código de Recuperación',
            text: `Tu código de recuperación es: ${token}`
        };
        
        await transporter.sendMail(mailOptions);
        return res.json({ mensaje: 'Código enviado' });
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error en el servidor', error });
    }
});

// Verificar código
router.post('/verificar-codigo', async (req, res) => {
    const { correo, token } = req.body;
    try {
        const [user] = await db.query('SELECT id_usuario FROM autenticacion WHERE correo = ?', [correo]);
        if (!user.length) return res.status(404).json({ mensaje: 'Correo no registrado' });
        
        const id_usuario = user[0].id_usuario;
        const [tokenDB] = await db.query('SELECT * FROM Token_Recuperacion WHERE id_usuario = ? AND token = ? AND fecha_expiracion > NOW()',
            [id_usuario, token]);
        
        if (!tokenDB.length) return res.status(400).json({ mensaje: 'Código inválido o expirado' });
        
        return res.json({ mensaje: 'Código válido' });
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error en el servidor', error });
    }
});

// Cambiar contraseña
router.post('/cambiar-contrasena', async (req, res) => {
    const { correo, nuevaContrasena } = req.body;
    try {
        const [user] = await db.query('SELECT id_usuario FROM autenticacion WHERE correo = ?', [correo]);
        if (!user.length) return res.status(404).json({ mensaje: 'Correo no registrado' });
        
        const id_usuario = user[0].id_usuario;
        const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);
        await db.query('UPDATE autenticacion SET contrasena_hash = ? WHERE id_usuario = ?', [hashedPassword, id_usuario]);
        
        return res.json({ mensaje: 'Contraseña actualizada correctamente' });
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error en el servidor', error });
    }
});

module.exports = router;
