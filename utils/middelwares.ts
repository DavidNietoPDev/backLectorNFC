import express from 'express';
const jwt = require('jsonwebtoken');
const { getSecretKeyDb } = require('../utils/secretKey');

const checkToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if(!req.headers['authorization']) {
        return res.json({error: 'No token provided'});
    }

    const token = req.headers['authorization'];

    let payload;
    try {
        payload = jwt.verify(token, 'en un lugar de la mancha');
    
    } catch (error) {
        return res.json({ error: 'El token no es válido'})
    }

    next();
}

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



module.exports = { checkToken, createToken }; 