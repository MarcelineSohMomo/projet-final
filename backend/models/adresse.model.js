import mongoose from 'mongoose';

const schema = mongoose.Schema

const role = new schema(
    { 
        name : {type: String},
        id : {type : String},
	    Street : {type : String},
	    Number : {type : Number},
	    PostalCode : {type : String},
	    CITY : {type : String},
	    COUNTRY : {type : String},

    } 
)

module.exports = mongoose.model('adress', role)