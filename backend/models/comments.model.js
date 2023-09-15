const mongoose =  require('mongoose');


const schema = mongoose.Schema

const Comment = new schema(
    { 
        text : {type: String},
		commenterId: { type: schema.Types.ObjectId, ref: 'user', required: true },
		serviceId: { type: schema.Types.ObjectId, ref: 'service', required: true },
        private: {type: Boolean, default: false}
    },{timestamps: true} 
)

module.exports = mongoose.model('comment', Comment)