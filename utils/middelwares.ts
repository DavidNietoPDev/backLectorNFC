import express from 'express';
const jwt = require('jsonwebtoken');

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


module.exports =  checkToken; 