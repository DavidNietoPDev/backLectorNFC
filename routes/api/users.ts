
import express from 'express';
const router = require('express').Router();
const User = require('../../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SecretKey = require('./models/SecretKey');

// POST /api/users/register
router.post('/register', async (req: express.Request, res: express.Response) =>{
    try {
        //encriptación, cuanto más número al final, más encriptado
        req.body.password = await bcrypt.hashSync(req.body.password, 12);   
        const user = await User.create(req.body);
        res.json(user);
    } catch (error: any) {
        res.json({error: error.message});
    }  
});

// POST /api/users/login

router.post('/login', async (req: express.Request, res: express.Response) =>{
    try {
        const user = await User.findOne({username: req.body.username});
        
        if(!user){
            return res.json({error: 'Error en usuario/contraseña'});
        }  

        const eq = bcrypt.compareSync(req.body.password, user.password);

        if(!eq){
            return res.json({error: 'Error en usuario/contraseña'});
        }

        res.json({success: 'Inicio de sesión correcto', 
        token: createToken(user)
    });
        
    } catch (error: any) {
        res.json({error: error.message});
    }
});

function createToken(user: any){
    const payload = 
    {
        user_id: user.id,
        user_role: user.role
    }
    generateAndSaveSecretKey();
    const secretKey = process.env.SECRET_KEY;
    return jwt.sign(payload, secretKey);
    }

    async function generateAndSaveSecretKey() {
        try {
          // Generar una cadena aleatoria para usar como clave
          const randomString = Math.random().toString(36).slice(-8);
      
          // Generar el hash de la cadena aleatoria usando bcrypt
          const hashedKey = await bcrypt.hash(randomString, 10);
      
          // Guardar la clave secreta en la base de datos
          const newSecretKey = new SecretKey({
            dateUpdate: new Date(),
            code: hashedKey,
          });
          await newSecretKey.save();
      
          console.log('Secret key generated and saved successfully');
        } catch (error) {
          console.error('Error generating and saving secret key:', error);
        }
      }
      

module.exports = router;