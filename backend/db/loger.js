const mongoose = require('mongoose');
const logSchema = new mongoose.Schema({
    name: { type: String, required: true },
    cname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    pass: { type: String, required: true },
    address: { type: String, required: true },
    logo: { type: String }
})
module.exports = mongoose.model('log', logSchema);