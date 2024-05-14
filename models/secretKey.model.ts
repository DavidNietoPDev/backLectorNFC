const { model, Schema } = require('mongoose');


const scSchema = new Schema({
    dateUpdate: Date,
    code: String,
});

module.exports = model('secretKey', scSchema);