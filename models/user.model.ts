const { model, Schema } = require('mongoose');


const userSchema = new Schema({
    email: String,
    password: String,
    role: {
        type: String,
        default: 'regular'
    }
});

module.exports = model('user', userSchema);