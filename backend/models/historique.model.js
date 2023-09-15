const mongoose =  require('mongoose');


const schema = mongoose.Schema

const Historique = new schema(
    { 
		comments: [{ type: schema.Types.ObjectId, ref: 'comment', required: true }],
		serviceId: { type: schema.Types.ObjectId, ref: 'service', required: true },
		savedService: {type: Object},
		userId: { type: schema.Types.ObjectId, ref: 'user', required: true },
    },{timestamps: true} 
)

module.exports = mongoose.model('historique', Historique)