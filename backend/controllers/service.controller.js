const { Service, User, Categorie, Comment, Note, Role } = require("../models");
const haversine = require("haversine-distance");
const MAX_DISTANCE = 1000_000 // en metre


const variablesIsEmpty = (req, res) => {
    if (!req || !req.params.id)
        return res.status(505).json({ message: "Des données importante sont manquantes" });
}

const bodyIsEmpty = (req, res) => {
    console.log(req.body.providerId)
    return (!req || !req.body.description || req.body.description === '' || !req.body.name || req.body.name === "" || !req.body.tarification);
}

module.exports.createService = async(req, res) => {
    try {
        if (bodyIsEmpty(req, res))
            return res.status(400).json({ message: "Données sont  manquantes" });
        req.body.providerId = req.userId
        const existingService = await Service.findOne({
            providerId: req.body.providerId,
            name: req.body.name
        });
        if (existingService)
            return res.status(400).json({ message: "Le service existe deja.", service: existingService });
        const provider = await User.findById(req.body.providerId);
        if (!provider)
            return res.status(404).json({ message: `Ce prestataire ID = ${req.body.providerId} n'existe pas.` });
        var service = new Service({
            description: req.body.description,
            name: req.body.name,
            tarification: req.body.tarification,
            providerId: req.body.providerId,
            others: req.body.others,
            keywords: req.body.keywords,
            geolocalisation: req.body.geolocalisation,
        });
        const categorie = await Categorie.findById(req.body.categorie);
        console.log("Categorie :", categorie)
        service.categorie = categorie._id
        const savedService = await service.save();
        provider.listservices.push(savedService._id);
        await provider.save();
        return res.status(200).json({ message: "Service crée avec succes ", service: savedService });
    } catch (error) {
        console.log(error)
        return res.status(505).json({ message: "An error has occured", err: `${error}` });
    }
}

module.exports.readService = async(req, res) => {
    try {
        variablesIsEmpty(req, res);

        const service = await Service.findById(req.params.id)
            .populate("providerId") // pour récupérer les infos de la création du service
            .populate("categorie")
            .populate({
                path: "listnotes",
                populate: {
                    path: "userId"
                }
            })
            .populate("likers")
            .populate({
                path: "listcomments",
                populate: {
                    path: "serviceId commenterId"
                }
            })

        if (!service)
            return res.status(404).json({ message: `Service non trouvé avec cet ID ${req.params.id}` });

        return res.status(200).json(service);
    } catch (error) {
        return res.status(505).json({ message: "An error has occured", error: `${error}` });
    }
}

module.exports.readServiceByProviderId = async(req, res) => {
    try {
        variablesIsEmpty(req, res);

        console.log("req2   ==>", req.body)
        const service = await Service.find({ providerId: req.params.id })
            .populate("providerId")
            .populate({
                path: "listcomments",
                populate: {
                    path: "serviceId commenterId"
                }
            })
            .populate({
                path: "listnotes",
                populate: {
                    path: "userId"
                }
            })
            .populate("likers")
            .populate({
                path: "listcommandes",
                select: 'createdAt updatedAt',
                populate: {
                    path: "customer",
                    select: 'createdAt updatedAt'
                }
            })
            .populate("categorie")

        if (!service)
            return res.status(404).json({ message: `Service non trouvé avec cet ID ${req.params.id}` });

        return res.status(200).json(service);
    } catch (error) {
        return res.status(505).json({ message: "An error has occured", error: `${error}` });
    }
}

module.exports.readServices = async(req, res) => {
    try {
        const services = await Service.find({})
            .populate("providerId")
            .populate("categorie")
        return res.status(200).send(services);
    } catch (err) {
        console.log(err)
        return res.status(505).json({ message: "An error has occured", error: `${err}` });
    }

}

module.exports.updateService = async(req, res) => {
    if (!req || !req.params.id)
        return res.status(505).json({ message: "Des paramètres importante sont manquantes" });

    try {
        const serviceUpdated = await Service.findByIdAndUpdate(
            req.params.id, {...req.body }, { new: true }
        );
        if (!serviceUpdated)
            return res.status(404).json({ message: "Service non trouvé" });
        return res.status(200).json({ message: "Successfully update", service: serviceUpdated });
    } catch (error) {
        console.log(error)
        return res.status(505).json({ message: "An error has occured", error: `${error}` });
    }
}

module.exports.findFavoriteService = async(req, res) => {
    const { id } = req.params
    try {
        if (!id)
            return res.status(404).json({
                message: "ID manquante"
            })
        const user = await User.findById(id);
        const services = await Service.find({
                _id: { $in: user.favoriteservice }
            })
            .populate("providerId")
            .populate({
                path: "listcomments",
                populate: {
                    path: "serviceId commenterId"
                }
            })
            .populate({
                path: "listnotes",
                populate: {
                    path: "userId"
                }
            })
            .populate("likers")
            .populate({
                path: "listcommandes",
                populate: {
                    path: "customer"
                }
            })
            .populate("categorie");
        return res.status(200).send(services);
    } catch (error) {
        return res.status(404).json({
            message: "Une erreur s'est produite lors de la recuperation des favories",
            error: error
        });
    }
}

module.exports.deleteService = async(req, res) => {
    if (!req || !req.params.id)
        return res.status(505).json({ message: "Des paramètres importante sont manquantes" });

    try {
        // const deletedService = await Service.findByIdAndDelete(req.params.id);
        const deletedService = await Service.findById(req.params.id);
        deletedService.isDeleted = true;
        await deletedService.save();
        if (!deletedService)
            return res.status(404).json({ message: "Service à supprimer est introuvable" });
        const user = await User.findById(deletedService.providerId);
        if (!user)
            return res.status(404).json({ message: "Le prestataire du service est introuvable" });
        user.listservices.pull(deletedService._id);
        await user.save();
        // await Comment.deleteMany({serviceId: deletedService._id});
        // await Note.deleteMany({serviceId: deletedService._id});
        return res.status(200).json({ message: "Service supprimée  avec success !" });
    } catch (error) {
        console.log(error)
        return res.status(505).json({ message: "Une erreur s'est produite.", error: `${error}` });
    }
}

module.exports.deleteAllUserService = async(req, res) => {
    if (!req || !req.params.id)
        return res.status(505).json({ message: "Des paramètres importante sont manquantes" });

    try {
        const deletedService = await Service.updateMany({providerId: req.params.id},{isDeleted:true},{ new: false, useFindAndModify: false});
        if (deletedService.modifiedCount == 0)
            return res.status(404).json({ message: "Les services à supprimer sont introuvables" });
        const user = await User.findByIdAndUpdate({_id:req.params.id},{$set:{listservices:[]}},{ new: true, useFindAndModify: false});
        if (!user)
            return res.status(404).json({ message: "Le prestataire du service est introuvable" });

        return res.status(200).json({ message: "Services supprimées  avec success !" });
    } catch (error) {
        console.log(error)
        return res.status(505).json({ message: "Une erreur s'est produite.", error: `${error}` });
    }
}

module.exports.copyServiceTo = async(req, res) => {
    try {
        const currentUser = await User.findById(req.userId);
        const roleAdmin = await Role.findOne({ name: "admin" });
        const roleCustomer = await Role.findOne({ name: "customer" });
        const roleProvider = await Role.findOne({ name: "provider" });
        const receiver = await User.findById(req.params.id);
        const service = await Service.findById(req.body.serviceId);

        const existingService = await Service.find({
            name: service.name,
            providerId: req.params.id
        })

        console.log("receiver")
        console.log(existingService.length)


        if (existingService.length !== 0) {
            return res.status(200).json({ message: "L'utilisateur a deja ce service!", });
        }
        const newService = new Service({
            description: service.description,
            name: service.name,
            tarification: service.tarification,
            providerId: receiver._id.toString(),
            others: service.others,
            categorie: service.categorie._id
        });
        const savedService = await newService.save();

        // if(receiver.listservices.includes(service._id.toString()))
        //     return res.status(200).json({ message: "L'utilisateur a deja ce service!",});
        // if (!receiver.listservices.includes(service._id.toString())) {
        receiver.listservices.push(savedService._id);
        // }
        if (receiver.roles.includes(roleCustomer._id)) {
            receiver.roles = [roleProvider._id];
        }
        const savereceiver = await receiver.save();
        return res.status(200).json({ message: "Service copié  avec success !" });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "La copie a échoué!", error: `${error}` });
    }
}

module.exports.searchServices = async(req, res) => {
    try {
        const query = {
            $or: [
               { name:{$regex :req.query.key, $options: 'i'}},
               { keywords:{$regex :req.query.key, $options: 'i'}},
            ]
        }
        const services = await Service.find(query)
            .populate("providerId")
            .populate("categorie")
        if(services.length == 0)
            return res.status(404).json({ message: "Aucun service trouvé!" });

        //Filtrer la liste des services en fonction de la distance entre le service le rechercheur
        const nearService = services.filter((s)=>{
            if(!s.geolocalisation)//Si les donnees de la localisation n'existe pas,
                return true
            const distance = haversine(s.geolocalisation, {lat:parseFloat(req.query.lat), lng:parseFloat(req.query.lng)});
            return (distance <= MAX_DISTANCE )? true: false
        });

        if(nearService.length == 0)
            return res.status(404).json({ message: "Le service souhaité ne se trouve pas dans votre circonférance" });
        
        return res.status(200).send(nearService);
    } catch (err) {
        console.log(err)
        return res.status(505).json({ message: "An error has occured", error: `${err}` });
    }

}