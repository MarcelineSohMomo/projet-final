const mongoose = require('mongoose');


const Note = new mongoose.Schema({
    value:{ type: 'Number'},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
    serviceId: {type: mongoose.Schema.Types.ObjectId, ref: 'service', required: true}
}, {timestamps: true});

module.exports = mongoose.model('note', Note);