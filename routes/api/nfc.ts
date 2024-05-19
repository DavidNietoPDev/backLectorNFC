import { Request, Response } from "express";
const router = require('express').Router();
import Nfc from "../../models/nfc.model";



router.post('/save', async (req: Request, res: Response) => {
    try {
        const { eventName, hashCodes }: { eventName: string; hashCodes: string[] } = req.body;

        if (!eventName || !Array.isArray(hashCodes) || hashCodes.length === 0) {
            return res.status(400).json({
                error: 'El nombre del evento y la lista de códigos hash son requeridos.'
            });
        }

        // Verificar si ya existe un evento con el mismo nombre en la base de datos
        const existingEvent = await Nfc.findOne({ eventName });
        if (existingEvent) {
            return res.status(409).json({
                error: 'El nombre del evento ya existe en la base de datos.'
            });
        }

        // Verificar si alguno de los hashCodes ya existe en la base de datos
        const existingHashDocs = await Nfc.find({ hashCodes: { $in: hashCodes } });
        const existingHashCodes = new Set();
        existingHashDocs.forEach((doc: { hashCodes: string[] }) => {
            doc.hashCodes.forEach((code: string) => {
                if (hashCodes.includes(code)) {
                    existingHashCodes.add(code);
                }
            });
        });

        if (existingHashCodes.size > 0) {
            return res.status(409).json({
                error: 'Uno o más códigos hash ya existen en la base de datos.',
                duplicates: Array.from(existingHashCodes)
            });
        }

        const newEvent = new Nfc({
            eventName,
            hashCodes
        });

        await newEvent.save();

        return res.status(200).json({
            success: 'El evento y los códigos hash se han guardado correctamente.'
        });

    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
});



module.exports = router;