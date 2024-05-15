import { Request, Response } from "express";
const router = require('express').Router();
const User = require('../../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getSecretKeyDb } = require('../../utils/secretKey');


// POST /api/users/register
router.post('/register', async (req: Request, res: Response) => {
    try {
        //encriptación, cuanto más número al final, más encriptado
        req.body.password = await bcrypt.hashSync(req.body.password, 12);
        const user = await User.create(req.body);
        res.json(user);
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
                res.json({
                    success: 'Inicio de sesión correcto',
                    token: createToken(user)
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
        console.log('Payload:', payload);
        console.log('Secret Key:', secretKey);
        const token = jwt.sign(payload, secretKey.toString());
        console.log('Token:', token);
        return token;
    } catch (error) {
        console.error('Error al generar el token:', error);
        throw error;
    }
}

module.exports = router;