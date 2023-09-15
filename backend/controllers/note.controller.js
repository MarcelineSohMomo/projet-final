const { User, Service, Note } = require("../models");

const variablesIsEmpty = (req, res)=> {
    return (!req || !req.body.userId || !req.body.serviceId || !req.body.value)  
}

module.exports.note = async (req, res) =>{
    try {
        if(variablesIsEmpty(req, res))
            res.status(505).json({ message: "Informations manquantes pour ajouter la note sur 5"});
        const existingNote = await Note.findOne({
            $and:[
                {userId: req.body.userId},
                {serviceId: req.body.serviceId}
            ]
        })
        if(existingNote){
            existingNote.value = req.body.value;
            await existingNote.save();
            return res.status(200).json({
                message: "Note mise à jour",
                note: existingNote,
                rating: req.body.value
            });
        }
        const note = new Note(req.body);
        await note.save().then(async (data) => {
            const user = await User.findById(req.body.userId);
            if(!user)
                return res.status(404).json({message: `Utilisateur non trouvé avec cet ID ${req.body.userId} `});
            const service = await Service.findById(req.body.serviceId);
            if(!service)
                return res.status(404).json({message: `Service non trouvé avec cet ID ${req.body.userId} `});
            if(!service.listnotes.includes(data._id)){
                service.listnotes.push(data._id);
                await service.save();
            }
            if(!user.listnotes.includes(data._id)){
                user.listnotes.push(data._id);
                await user.save();
            }
            return res.status(200).json({ 
                message: "Service noté avec success",
                rating: req.body.value,
                newNote: data
            });
 
        
        });

    } catch (error) {
        console.log(error)
        return res.status(505).json({ message: "Une erreur s'est produite lors de l'ajout de la note"});
    }
}

module.exports.readServiceNotes =  async (req, res) =>{
    if(!req.params.id)
        return res.status(500).json({ message: `Id = ${req.params.id} non valide.`}); 
    try {
        const notes= await Note.find({serviceId:req.params.id})
        .populate("userId")
        .populate("serviceId");
        if(!notes)
            return res.status(500).json({ message: `Note ${req.params.id} non trouvée ou n'existe plus.`}); 

        return res.status(200).json(notes);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Une erreur s'est produite lors de la recuperation des notes"});
    }
}

module.exports.readUserNotes =  async (req, res) =>{
    if(!req.params.id)
        return res.status(500).json({ message: `Id = ${req.params.id} non valide.`}); 
    try {
        const notes= await Note.find({userId : req.params.id})
        .populate("serviceId")
        .populate("userId")
        
        if(!notes)
            return res.status(500).json({ message: `Note ${req.params.id} non trouvée ou n'existe plus.`}); 

        return res.status(200).json(notes);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Une erreur s'est produite lors de la recuperation des notes"});
    }
}
module.exports.readNotes =  async (req, res) =>{
    try {
        const notes= await Note.find({});
        return res.status(200).json({note: notes});
    } catch (error) {
        return res.status(500).json({ message: "Une erreur s'est produite lors de la recuperation des notes"});
    }
}

module.exports.deleteNote =  async (req, res) =>{
    if(!req.params.id)
        return res.status(404).json({ message: " Id de la note manquante"});
    try {
        const note= await Note.findByIdAndDelete(req.params.id);
        if(!note)
            return res.status(404).json({message: "Note à supprimer non trouvé"});
        const user = await User.findById(note.userId);
        if(!user)
            return res.status(404).json({message: `Utilisateur ayant noté le service  est introuvable avec cet ID ${req.body.userId} `});
        const service = await Service.findById(note.serviceId);
        if(!service)
            return res.status(404).json({message: `Service noté reste introuvable avec cet ID ${req.body.userId} `});
        if(service.listnotes.includes(note._id)){
            service.listnotes.pull(note._id);
            await service.save();
        }
        if(user.listnotes.includes(note._id)){
            user.listnotes.pull(note._id);
            await user.save();
        }
        return res.status(200).json({message: "Note supprimée avec success. ", note: note});
    } catch (error) {
        return res.status(500).json({ message: "Une erreur s'est produite lors de la recuperation des notes"});
    }
}