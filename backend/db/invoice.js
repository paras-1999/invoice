const mongoose = require('mongoose');
const invoiceSchema = new mongoose.Schema({
    email: { type: String, required: true },
    invoicenumber: { type: Number, required: true },
    details: { type: Array, required: true },
    total: { type: Number, required: true },
    reciever: { type: Object, required: true },
    status: { type: String, required: true },
})
module.exports = mongoose.model('invoicenumber', invoiceSchema);