const mongoose = require('mongoose');

const CommandeSchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'service'
  },
  saveService: {
    type: Object,
  },
  name: {
    type: String,
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  }
}, {timestamps: true});

module.exports = mongoose.model('commande', CommandeSchema);
