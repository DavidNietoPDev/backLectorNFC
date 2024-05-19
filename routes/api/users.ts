import { Request, Response } from "express";
const router = require('express').Router();
const User = require('../../models/user.model');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator')
const { createToken } = require('../../utils/middelwares');


// POST /api/users/register
router.post('/register', async (req: Request, res: Response) => {
    try {
        //verificación de email correcto
        if (!validator.isEmail(req.body.email)) {
            return res.json({
                error: 'Por favor, introduce un correo electrónico válido'
            });
        }
        //verificar si está duplicado en bbdd
        const userNew = await User.findOne({ email: req.body.email });
        if (userNew) {
            return res.json({
                error: 'El correo electrónico introducido ya existe en la base de datos'
            });
        } else {
            //encriptación contraseña, cuanto más número al final, más encriptado
            req.body.password = await bcrypt.hashSync(req.body.password, 12);
            const user = await User.create(req.body);
            res.json(user);
        }
    } catch (error: any) {
        res.json({ error: error.message });
    }
});


router.post('/login', async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(401).json({ error: 'Error en usuario/contraseña', status: 401 });
        }

        const eq = bcrypt.compareSync(req.body.password, user.password);
        if (!eq) {
            return res.status(401).json({ error: 'Error en usuario/contraseña', status: 401 });
        }

        const token = await createToken(user);
        res.json({
            success: 'Inicio de sesión correcto',
            token: token
        });
    } catch (error: any) {
        // Manejo de errores específicos
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({ error: error.message, status: 400 });
        }
        
        // Otros errores
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error interno del servidor al iniciar sesión', status: 500 });
    }
});


module.exports = router;