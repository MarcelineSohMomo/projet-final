const { User, Comment, Service } = require("../models");

const variablesIsEmpty = (req, res)=> {
    if(!req || !req.body.commenterId || !req.body.serviceId || !req.body.text)
        return res.status(505).json({ message: "Informations manquantes pour creer le message"});  
}

module.exports.createComment = async (req, res) => {
    if(!req || !req.body.commenterId || !req.body.serviceId || !req.body.text)
        return res.status(505).json({ message: "Informations manquantes pour creer le message"});  
    const comment = new Comment(req.body);
    const user = await User.findById(req.body.commenterId);
        if(!user)
            return res.status(404).json({message: `Utilisateur voulant commenté le service  est introuvable avec cet ID ${req.body.userId} `});
        const service = await Service.findById(req.body.serviceId);
        if(!service)
            return res.status(404).json({message: `Service commenté reste introuvable avec cet ID ${req.body.userId} `});

    try {
        await comment.save();
        if(!service.listcomments.includes(comment._id)){
            service.listcomments.push(comment._id);
            await service.save();
        }
        if(!user.listcomments.includes(comment._id)){
            user.listcomments.push(comment._id);
            await user.save();
        }
        return res.status(200).send(comment);
    } catch(err) {
        console.log(err);
        res.status(505).json({ message: "Informations manquantes pour creer le message"});
    }
}



module.exports.readComments = async (req, res) => {
    try {
        const comments = await Comment.find({private: false})
        .populate("commenterId","firstname lastname img")
        .populate("serviceId")
        
        return res.status(200).json({comments: comments});
    } catch (error) {
        return res.status(404).json({message: "Une erreur s'est produite lors de la recuperation des commentaires", error: `${error}`});
    }
}

module.exports.readComment = async (req, res) => {
    try {
        if(!req.params.id)
            res.status(404).json({message: `Informations manquantes pour ecrire le commentaire  ${req.params.id}`});
        const comment = await Comment.findById(req.params.id)
        .populate("commenterId","firstname lastname img")
        if(!comment)
            res.status(404).json({message: "Commentaire non trouvé"});
    return res.status(200).json({comments: comment});
    } catch (error) {
        
    }
}

module.exports.getPrivateComments = async (req, res) => {
    const {id} = req.params;
    try {
        const comments = await Comment.find({commenterId:id,  private: true});
        return res.status(200).send(comments);
    } catch (error) {
        console.log(error)
        return res.status(404).json({message: "Une erreur s'est produite lors de la recuperation des commentaires", error: `${error}`});
    }
}

module.exports.readCommentsByTabIds = async (req, res) => {
    try {
        console.log(req.body.ids)
        const ids = req.body.ids;
        if(!ids)
            res.status(404).json({message: `Informations manquantes pour lire les commentaires Ids = ${req.body.ids} `});

        const comments = await Comment.find({ private: false}).where('_id').in(ids).populate("commenterId","firstname lastname img").exec();

        if(!comments)
            res.status(404).json({message: "Aucun commentaire trouvé pour les ids donnés"});
        return res.status(200).send(comments);
    } catch (error) {
        console.log(`Une erreur c'est produite lors de la recuperation des commentaires ${error}`);
    }
}


module.exports.updateComment = async (req, res) => {
    
    try {
        if(!req.params.id || !req.body.text)
            return res.status(404).json({message: `Commentaire non trouvé. ID ou TEXT manquants  ${req.params.id}`});
        console.log("req.body ", req.body);
        console.log("req.params.id ", req.params.id);

            const commentUpdated = await Comment.findByIdAndUpdate(
            req.params.id,
            { text: req.body.text},
            { new: true }
        );
        if(!req.params.id)
            return res.status(404).json({ message: `Echec de mise à jour du commentaire  ${req.params.id}`});
        return res.status(200).json(commentUpdated);

    } catch (error) {
        console.log(error)
    }
}

module.exports.deleteComment = async (req, res) => {
    if(!req.params.id)
        return res.status(404).json({message: `ID manquante  ${req.params.id}`});
    const commentDeleted = await Comment.findByIdAndDelete(
        req.params.id,
        { new: true }
    );
    if(!commentDeleted)
        return res.status(404).json({message: `Impossible de supprimer le commentaire ayant ID = ${req.params.id}`});
        
    const user = await User.findById(commentDeleted.commenterId);
    if(!user)
        return res.status(404).json({message: `Utilisateur ayant commenté le service  est introuvable avec cet ID ${req.body.userId} `});
    const service = await Service.findById(commentDeleted.serviceId);
    if(!service)
        return res.status(404).json({message: `Service commenté reste introuvable avec cet ID ${req.body.userId} `});
    if(service.listcomments.includes(commentDeleted._id)){
        service.listcomments.pull(commentDeleted._id);
        await service.save();
    }
    if(user.listcomments.includes(commentDeleted._id)){
        user.listcomments.pull(commentDeleted._id);
        await user.save();
    }
    return res.status(200).json({ 
        message: "Commentaire supprimé avec success",
        commentDeleted: `${commentDeleted}`
    });
}