const { mongoose, Schema } = require("mongoose");


const Message = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: 'conversation',
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  
  { timestamps: true }
);

module.exports = mongoose.model('message', Message)

