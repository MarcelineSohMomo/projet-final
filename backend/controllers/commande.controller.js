const { Commande, Service, User } = require("../models");
const isEmpty = (data) =>{
    return !data.serviceId || !data.name || !data.customer || !data.status;
}
exports.createCommande = async (req, res) => {
    const { serviceId, name, customer, price, status , provider} = req.body;
    if(isEmpty(req.body))
        return res.status(500).json({ message: "L'ID ou NAME du service sont vides." });

    try {
        const newCommande = new Commande({ serviceId, name, customer, price, status, provider });
        const savedCommande = await newCommande.save();
        
        if(savedCommande){
            const service =  await Service.findById(serviceId);
            const userCustomer =  await User.findById(customer);
            userCustomer.listcommandes.push(savedCommande._id);
            userCustomer.save();
            service.listcommandes.push(savedCommande._id)
            service.save();
            savedCommande.saveService = service;
            savedCommande.save();
        }
        
        console.log(savedCommande)
        res.status(201).json({
            message: "Commande enrégistrée avec succes.",
            order: savedCommande
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCommandes = async (req, res) => {
    try {
        const commandes = await Commande.find()
        .populate('customer')
        .populate({
            path: 'serviceId',
            populate : {
                path: 'providerId, commenterId',
            }
        });
        return res.status(200).json(commandes);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.getCommande = async (req, res) => {
    const { id } = req.params;
    
    try {
        const commande = await Commande.findById(id)
        .populate('customer')
        .populate({
            path: 'serviceId',
            populate : {
                path: 'providerId',
            }
        });
        return res.status(200).json(commande);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.getCommandeByUserId = async (req, res) => {
  const { id } = req.params;
  
  try {
      const commande = await Commande.find({customer: id})
      .populate('customer')
      .populate({
          path: 'serviceId',
          populate : {
              path: 'providerId',
          }
      });
        return res.status(200).json(commande);
  } catch (error) {
        return res.status(500).json({ error: error.message });
  }
};

exports.getCommandeByProvider = async (req, res) => {
    const { id } = req.params;
    
    try {
        const commande = await Commande.find({provider: id})
        .populate('customer')
        .populate({
            path: 'serviceId',
            populate : {
                path: 'providerId',
            }
        });
          return res.status(200).json(commande);
    } catch (error) {
          return res.status(500).json({ error: error.message });
    }
  };
exports.updateCommande = async (req, res) => {
    const { id } = req.params;
    if(!id || !req.body.status)
        return res.status(404).json({
            message: `Requete incomplete. Informations manquantes ${req.body}`
        });
    const { serviceId, name, customer, price, status } = req.body;

    try {
        const updatedCommande = await Commande.findByIdAndUpdate(
            id,
            { status: status },
            { new: true }
        );
        if(!updatedCommande)
            return res.status(404).json({
                message: `Commande non trouvé id: ${id}`
            });
        res.status(200).json({
            message: 'Commande mis à jour avec success',
            status: updatedCommande.status
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
};

exports.deleteCommande = async (req, res) => {
    const { id } = req.params;
    if(!id)
        return res.status(404).json({
            message: `Requete incomplete. ID manquante ${id}`
        });
    try {
        await Commande.findByIdAndDelete(id);
        res.status(200).json({ message: 'Commande supprimée' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.groupCommandsByStatus = async (req, res) => {
    try {
      console.log("req.params.id ", req.params.id);
    //   const matchStage = { $match: { provider: req.params.id } };
    //   const groupStage = { $group: { _id: '$status', commands: { $push: '$$ROOT' } } };
    //   const commandsByStatus = await Commande.aggregate([matchStage, groupStage]);
      const providerCommands = await Commande.find({ provider: req.params.id })
    //   commandsByStatus.forEach((group) => {
    //     console.log(`Statut : ${group._id}`);
    //     console.log(group.commands);
    //   });

    // const groupedCommands = providerCommands.reduce((result, command) => {
    //     const status = command.status;
    //     if (!result[status]) {
    //       result[status] = [];
    //     }
    //     result[status].push(command);
    //     return result;
    // }, {});

    const commandsGroupByService = {};

    // Parcourir les commandes et les regrouper par serviceId
    providerCommands.forEach((command) => {
      const { serviceId, status } = command;

      if (!commandsGroupByService[serviceId]) {
        commandsGroupByService[serviceId] = {};
      }

      if (!commandsGroupByService[serviceId][status]) {
        commandsGroupByService[serviceId][status] = [];
      }

      commandsGroupByService[serviceId][status].push(command);
    });
        console.log("commandsGroupByService ", commandsGroupByService);

      return res.status(200).json(commandsGroupByService);
    } catch (error) {
      console.error("Une erreur s'est produite lors du regroupement des commandes par statut", error);
      return res.status(500).json({ message: error.message });
    }
  };
  

