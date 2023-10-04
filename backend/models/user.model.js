const { mongoose, Schema } = require("mongoose");
const { Service } = require(".")
const schema = mongoose.Schema;

const User = new schema(
  {
    firstname: { type: String,  },
    lastname: { type: String },
    email: { type: String },
    phone: { type: String },
    img: {
      data: { type: Buffer},
      contentType: { type: String},
    },
    dateOfBirth: { type: String },
    description: { type: String },
    password: { type: String },
    isVerifed: { type: Object },
    languages: { type: Array },
    postes : { type: String },
    certifications: { type: Array },
    qualification: { type: Array },
    roles: [ {type: Schema.Types.ObjectId, ref: "role"}],
    listservices: [{ type: Schema.Types.ObjectId, ref: 'service' }],
    listnotes: [{ type: Schema.Types.ObjectId, ref: 'note' }],
    listcomments: [{ type: Schema.Types.ObjectId, ref: 'comment' }],
    listcommandes: [{ type: Schema.Types.ObjectId, ref: 'commande' }],
    favoriteservice: [{ type: Schema.Types.ObjectId, ref: 'service' }],
    orders: [{ type: Schema.Types.ObjectId, ref: 'order' }],
    conversations: [{ type: Schema.Types.ObjectId, ref: 'conversation' }],
    resetPassword: { type: Boolean },

  },
  { timestamps: true }
);


module.exports = mongoose.model("user", User);
