const mongoose = require("mongoose");
const { Comment, Note } = require(".")

const schema = mongoose.Schema;

const Service = new schema({
    id: { type: String },
    name: { type: String },
    description: { type: Object },
    imgs: [{type : String}],
    tarification : { type: Object },
    availability:{ type: Array },
    categorie : { type: mongoose.Schema.Types.ObjectId, ref: "categorie"  },
    others: { type: String },
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    likers: [{type: mongoose.Schema.Types.ObjectId, ref: "user"}],
    listnotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "note" }],
    listcommandes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'commande' }],
    listcomments: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment" }],
    keywords: { type : String },
    isDeleted: { 
        type: Boolean,
        default: false
    },
    geolocalisation: { type: Object },

}, {timestamps: true});


module.exports = mongoose.model("service", Service);

