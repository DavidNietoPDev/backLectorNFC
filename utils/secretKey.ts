const SecretKey = require('../models/secretKey.model');
const bcrypt = require('bcryptjs');


async function getSecretKeyDb() {
    try {
        // Buscar la clave secreta más reciente en la base de datos
        const lastSecretKey = await SecretKey.findOne().sort({ dateUpdate: -1 });
        if (lastSecretKey) {
            console.log('secretKey obtenida correctamente')
            return lastSecretKey.code;
        } else {
            console.error('No se encontró ninguna clave secreta en la base de datos.');
            const newSecretKey = await genAndSavSecretKey(); 
            return newSecretKey.code;
        }
    } catch (error) {
        console.error('Error obteniendo la clave secreta de la base de datos:', error);
        throw error;
    }
}


async function genAndSavSecretKey() {
    try {
        // Busca la clave secreta más reciente en la base de datos
        const lastSecretKey = await SecretKey.findOne().sort({ dateUpdate: -1 });
        console.log(lastSecretKey, 'Última clave secreta en genAndSave')
        // Si no hay ninguna clave o la clave más reciente es demasiado antigua
        if (!lastSecretKey || isKeyTooOld(lastSecretKey.dateUpdate)) {
            // Generar una nueva clave y guardarla en la base de datos
            const randomString = Math.random().toString(36).slice(-8);
            const hashedKey = await bcrypt.hash(randomString, 10);
            const newSecretKey = new SecretKey({
                dateUpdate: new Date(),
                code: hashedKey,
            });
            await newSecretKey.save();
            console.log('Nueva clave secreta generada y guardada en la bbdd.');
            return newSecretKey;
        } else {
            console.log('No se requiere generar una nueva clave secreta.');
        }
    } catch (error) {
        console.error('Error generando y guardando la clave secreta:', error);
    }
}

function isKeyTooOld(keyDate: Date) {
    // Define el tiempo máximo entre actualizaciones de la clave secreta (por ejemplo, 1 día)
    const time = 24 * 7 * 60 * 60 * 1000; // 1 semana en milisegundos
    const now = new Date().getTime();
    const lastSecretKey = keyDate.getTime();
    // Compara la diferencia entre la fecha actual y la fecha de la última actualización de la clave
    const timeRest = now - lastSecretKey;
    console.log('tiempo restante de secretKye = ' + timeRest);
    return timeRest > time;
}

module.exports = { getSecretKeyDb, genAndSavSecretKey }

