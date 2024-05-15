import { Request, Response } from "express";
const router = require('express').Router();
const User = require('../../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getSecretKeyDb } = require('../../utils/secretKey');


// POST /api/users/register
router.post('/register', async (req: Request, res: Response) => {
    try {
        const userNew = await User.findOne({ username: req.body.username });
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
    


    // POST /api/users/login

    router.post('/login', async (req: Request, res: Response) => {
        try {
            const user = await User.findOne({ username: req.body.username });

            if (!user) {
                return res.json({ error: 'Error en usuario/contraseña' });
            } else {
                const eq = bcrypt.compareSync(req.body.password, user.password);
                if (!eq) {
                    return res.json({ error: 'Error en usuario/contraseña' });
                } else {
                    const token = await createToken(user);
                    res.json({
                        success: 'Inicio de sesión correcto',
                        token: token
                    });
                }
            }
        } catch (error: any) {
            res.json({ error: error.message + '. Error al iniciar sesión' });
        }
    });

    async function createToken(user: any) {
        try {
            const payload = {
                user_id: user.id,
                user_role: user.role
            };
            const secretKey = await getSecretKeyDb();
            const token = jwt.sign(payload, secretKey);
            return token;
        } catch (error) {
            console.error('Error al generar el token:', error);
            throw error;
        }
    }

    module.exports = router;