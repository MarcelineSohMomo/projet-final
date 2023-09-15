const { type } = require("express/lib/response");
const { mongoose } = require("mongoose");

const schema = mongoose.Schema

const Role = new schema(
    { 
        name : {type: String},
        value : {type: Number},
        description : {type : String}
    },{timestamps: true}
)

module.exports = mongoose.model('role', Role);