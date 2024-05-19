
import { Document, Schema } from "mongoose";
import mongoose from "mongoose";

interface Nfc extends Document {
    eventName: string;
    hashCodes: string[];
}

const nfcSchema = new Schema({
    eventName: {
        type: String,
        required: true,
        trim: true
    },
    hashCodes: {
        type: [String],
        required: true
    }
});

const Nfc = mongoose.model<Nfc>('Nfc', nfcSchema);

export default Nfc;