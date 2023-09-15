const { type } = require("express/lib/response");
const { mongoose } = require("mongoose");

const schema = mongoose.Schema

const Categorie = new schema(
    { 
        name : {type: String},
    },{timestamps: true}
)

module.exports = mongoose.model('categorie', Categorie);