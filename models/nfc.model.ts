const { model, Schema } = require('mongoose');


const nfcSchema = new Schema({
    nfcCode: String,
    hashCode: String,
});

module.exports = model('nfc', nfcSchema);