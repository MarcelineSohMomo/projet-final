// const { User, Msg, Note, Conversation } = require("../models");

const { default: mongoose } = require("mongoose");
const { Conversation, Message } = require("../models");

// const notFoundResource = (resource, message) =>{
//     if(!resource)
//         return res.status(404).json({message: message});
// }
// const credentialVariablesIsEmpty = (req, res)=> {
//     if(!req || !req.body.senderId || !req.body.receiverId || !req.body.text)
//         return res.status(505).json({ message: "Informations manquantes pour creer le message"});  
// }

// module.exports.sendMsg = async (req, res) => {
//     credentialVariablesIsEmpty(res, req);
//     const newMsg = new Msg(req.body);
//     await newMsg.save().then(async (msg) =>{
//         const existingConversation = await Conversation.find({
//             users: { 
//                 $all: [req.body.senderId, req.body.receiverId]
//             }
//         });
//         if(!existingConversation){
//             const newConversation = new Conversation({
//                 users: [req.body.senderId, req.body.receiverId],
//                 messages: [msg._id]
//             })
//             await newConversation.save().then(data => res.status(200).json({data: data}));
//         }
//         existingConversation.messages.push(msg._id);
//         await existingConversation.save().then(data => res.status(200).json({data: data}));
//     }).catch(err => res.status(500).json({ 
//         message: "Une erreur s'est produite lors de l'enregistrement du message.",
//         err:`${err}`
//     }))
    
// }

// module.exports.readMsg = async (req, res) => {
    
// }

// module.exports.readConversation = async (req, res) => {
//     const id1 = req.query.userId1;
//     const userId2 = req.query.userId2;

//     if(!userId1 || !userId2)
//         return res.status(505).json({ message: "Les IDs de la conversation manquante "});  
    
//     const messages = await Msg.find({
//         $or: [
//             { senderId: userId1, receiverId: userId2 },
//             { senderId: userId2, receiverId: userId1 }
//         ]
//     });

//     if(!messages)
//         return res.status(404).json({
//             message: "Conversation vide"
//         });

//     return res.status(200).json(messages);
// }

// module.exports.readConversations = async (req, res) => {
//     const id = req.params.id;

//     if(!id)
//         return res.status(505).json({ message: "ID de la conversation manquante "});  
    
//     try {
//         const conversations = await Conversation.find({ users: { $in: [id] } })
//             .populate('users', 'firstname lastname img')
//             .populate('messages')
//             .exec();
    
//         if (!conversations) {
//             return res.status(404).json({ message: `Pas de conversations trouvée pour cet utilisateur ${id}` });
//         }
    
//         return res.status(200).json(conversations);
//         } catch (error) {
//         return res.status(500).json({ message: error.message });
//         }
// }


// module.exports.deleteConversation = async (req, res) => {
//     if(!req.params.id)
//         return res.status(505).json({ message: "ID de la conversation manquante "});  
//     const conversation = await Conversation.findById(req.params.id);
//     await conversation.remove();
//     notFoundResource(!conversation, "Conversation a supprimé non trouvée");
//     return res.status(200).json({ data: conversation});
// }

// module.exports.updateMsg = async (req, res) => {
//     const msg = await Msg.findByIdAndUpdate(
//         req.params.id,
//         { text: req.body.text },
//         { new: true }
//     );
//     notFoundResource(!msg, `Msg non trouvée. ID: ${req.params.id}`);
//     return res.status(200).json({ data: msg});  
// }

// module.exports.deleteMsg = async (req, res) => {
//     const deleteMsg = await Msg.findByIdAndDelete(
//         req.params.id,
//     );    
//     notFoundResource(!deleteMsg, `Conversation à supprimé non trouvée. ID: ${req.params.id}`);
//     return res.status(200).json({ data: deleteMsg});  
// }

module.exports.createMessage = async (req, res) => {
    if(!req.body.text || !req.body.sender || !req.body.conversationId )

        return res.status(500).json({
            message: "Veuillez bien choisir le destinataire ou  Renseigner un texte pour creer un mesage"
        });
    const newMessage = new Message(req.body);
    try {
      const savedMessage = await newMessage.save();
      return res.status(200).json(savedMessage);
    } catch (error) {
        return res.status(500).json(error);
    }
  };

  exports.createConversation = async (req, res) => {
    if(!req.body.participant1Id || !req.body.participant2Id){
        console.log(req.body)
        return res.status(500).json({
            message: "Renseigner plus d'information pour creer une conversation"
        });
    }


    const { participant1Id, participant2Id } = req.body;
    const existingConversation = await Conversation.findOne({
        participants: { $all : [participant1Id, participant2Id]}
    })
    console.log("existingConversation ", existingConversation)

    if(existingConversation){
        console.log("sending ...")
        return res.status(200).send(existingConversation);
    }


    const newConversation = new Conversation({
        participants: [participant1Id, participant2Id],
    });

    try {
        const savedConversation = await newConversation.save();

        console.log("savedConversation ", savedConversation)
        return res.status(200).json(savedConversation);
    } catch (error) {
        console.log(error)
        return res.status(500).json(error);
    }
};

  
module.exports.getConversations = async (req, res) => {
    const { id } = req.params;
    if (!id)
        return res.status(404).send({
            message: `Données manquantes. ID : ${id}`
        });
    try {
        await Conversation.find({ participants: { $in: [id] } })
            .then(async conversations => {
                const conversationIds = conversations.map(c => c._id);

                await Message.aggregate([
                    {
                        $match: { conversationId: { $in: conversationIds } }
                    },
                    {
                        $group: {
                            _id: '$conversationId',
                            messages: { $push: '$$ROOT' },
                        }
                    },
                    {
                        $addFields: {
                            conversationId: '$_id',
                        }
                    }
                ]).then(async groupedMessages => {
                    console.log("groupedMessages =>", groupedMessages)
                    const options = [
                        { path: 'message.sender', select: 'firstname lastname' },
                        { path: 'conversationId' }
                    ];

                    const populatedConversation = await Message.populate(groupedMessages, options)
                    if (populatedConversation)
                        return res.status(200).send(populatedConversation);
                })
            })
    } catch (error) {
        console.log(error)
        return res.status(404).send({
            message: "Une erreur s'est produite lors du chargement des messages"
        });
    }
}


module.exports.deleteMessage = async (req, res) => {
    if(!req.params.id)
        return res.status(404).json({ 
            message: `ID non reconnu ${req.params.id}`,
        });
    try {
        const deleteMsg = await Message.findByIdAndDelete(
            req.params.id,
        );    
        if(!deleteMsg)
            return res.status(404).json({
                message: `  ID non reconnu : ${req.params.id}`
            })
        return res.status(200).json({ 
            message: "Message supprimé avec success",
            deleteMsg: deleteMsg
        })
    } catch (error) {
        console.log(error)
        return res.status(404).json({ 
            message: "Echec de suppression",
        });
    }  
}

module.exports.updateMessage = async (req, res) => {
    console.log(req.params)
    try {
        const msg = await Message.findByIdAndUpdate(
            req.params.id,
            { text: req.body.text },
            { new: true }
        );
        if(!msg)
            return res.status(404).json({
                message: `Msg non trouvée. ID: ${req.params.id}`
            })
        return res.status(200).send(msg);  
    } catch (error) {
        console.log(error)
    }
}
