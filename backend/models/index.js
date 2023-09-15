const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var db = {}
module.exports.ROLES = {
    "customer" : 1,
    "provider" : 2, 
    "moderator": 3, 
    "admin": 4
};
db.User = require("./user.model");
db.Note = require("./note.model");
db.Role = require("./role.model");
db.Service = require("./service.model");
db.Comment = require("./comments.model");
db.Conversation = require("./conversation.model");
db.Message = require("./message.model");
db.Image = require('./image.model');
db.Categorie = require('./categorie.model');
db.Commande = require('./commande.model');
db.Historique = require('./historique.model');
db.roleToNumber = (role) => {
    switch (role) {
      case 'customer':
        return 1;
      case 'provider':
        return 2;
      case 'moderator':
        return 3;
      case 'admin':
        return 4;
      default:
        return -1; // Retourne -1 si le rôle n'est pas trouvé
    }
};
module.exports = db

