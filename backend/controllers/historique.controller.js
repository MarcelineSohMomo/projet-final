const { Historique, Comment, Service } = require("../models");


exports.createHistorique = async (req, res) => {
    const { serviceId, comment, userId} = req.body;
    if(!serviceId || !comment || !userId)
        return res.status(400).json({
            message: `Des données sont manquantes. ${serviceId} ${comment} ${userId}`
        })

    console.log("req body :: ", req.body)
    try {
        const newComment = new Comment({
            text : comment,
            commenterId : userId,
            serviceId : serviceId,
            private: true
        })
        const commentSaved = await newComment.save();
        const existingHistorique = await Historique.findOne({serviceId : req.body.serviceId})
        if(existingHistorique){
            existingHistorique.comments.push(commentSaved._id);
            const existingHistoriqueSave = await existingHistorique.save();
            return res.status(201).json(commentSaved);

        }
        const newHistorique = new Historique({
            comments: [commentSaved._id],
            serviceId: serviceId,
            userId: userId
        });
        const service =  await Service.findById(serviceId);
        newHistorique.savedService = service;
        newHistorique.save();
        const savedHistorique = await newHistorique.save();
        console.log(commentSaved)
        return res.status(201).json(commentSaved);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};

exports.getHistorique = async (req, res) => {
    if(!req.params.id)
        return res.status(200).json({
            message: `Donnée manquante. Id: ${req.params.id} `
        })
    try {
        
        const query = {userId: req.params.id};
        const order = req?.query?.order||1;
        const sort = {};
        if(req.query.sortby == 'date')
            sort.createdAt = order

        const historique = await Historique.find(query)
        .populate('comments serviceId')
        .sort(sort);
        return res.status(200).json(historique);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Une erreur s'est produite",
            error: error
        });
    }
};

exports.updateHistorique = async (req, res) => {
    if(!req.params.id)
        return res.status(200).json({
            message: `Donnée manquante. Id: ${req.params.id} `
        })
    try {
        const updatedHistorique = await Historique.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({
            message:" Mise à jour reussir",
            historique: updatedHistorique
        });
    } catch (error) {
        return res.status(500).json({
            message: "Une erreur s'est produite",
            error: error
        });
    }
};

exports.deleteHistorique = async (req, res) => {
    try {
        await Historique.findByIdAndDelete(req.params.id);
        res.status(200).json("Historique deleted successfully");
    } catch (error) {
        return res.status(500).json({
            message: "Une erreur s'est produite",
            error: error
        });
    }
};
