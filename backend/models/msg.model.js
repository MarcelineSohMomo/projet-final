const mongoose = require('mongoose');


const Msg = new mongoose.Schema({
    text:{ type: String},
    senderId: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
    receiverId: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true}
}, {timestamps: true});