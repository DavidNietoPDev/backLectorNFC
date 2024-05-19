import express from 'express';
const jwt = require('jsonwebtoken');
const { getSecretKeyDb } = require('../utils/secretKey');

 const checkToken = async (req: express.Request, res: express.Response, next: express.NextFunction) =>  {
    
    if(!req.headers['authorization']) {
        return res.json({error: 'No token provided'});
    }
    const token = req.headers['authorization'];
    const secretKey = await getSecretKeyDb();
    let payload;

    try {
        payload = jwt.verify(token, secretKey);
        // Verificar si el token ha expirado
        const tokenExp = new Date(payload.exp * 1000);
        const currentTime = new Date();
        if (tokenExp <= currentTime) {
            return res.json({ error: 'El token ha expirado' });
        }

    } catch (error) {
        return res.json({ error: 'El token no es válido' });
    }
    next();
}

async function createToken(user: any) {
    try {
        const payload = {
            user_id: user.id,
            user_role: user.role,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (60 * 60)
        };
        const secretKey = await getSecretKeyDb();
        const token = jwt.sign(payload, secretKey);
        return token;
    } catch (error) {
        console.error('Error al generar el token:', error);
        throw error;
    }
}



module.exports = { checkToken, createToken }; 