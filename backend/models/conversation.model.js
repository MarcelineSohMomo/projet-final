const mongoose = require('mongoose');
const { Msg } = require(".");


const Schema = mongoose.Schema;

const Conversation = new Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: 'user', required: true }],
}, {timestamps: true});


module.exports = mongoose.model('conversation', Conversation);
