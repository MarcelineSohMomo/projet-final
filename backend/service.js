const { signUpUser, signin, signUpArtisan, signUpModerator } = require("./controllers/auth.controller");
const { addRoleForUser, deleteRole, getRoles, findRole, updateRole, xxxxxxxxxx } = require("./controllers/role.controller");
const { like, favorite } = require("./controllers/favorite.controller");
const { updateUser, deleteUser, findUser, getUsers, getAdminInfo, getUsersWithoutCustomer, updateAvailability, getUsersAndNotification } = require("./controllers/user.controller");
const { createService, readService, readServices, searchServices, updateService, deleteService, deleteAllUserService, readServiceByProviderId, findFavoriteService, copyServiceTo } = require("./controllers/service.controller");
const { note, readNotes, readServiceNotes, deleteNote, readUserNotes } = require("./controllers/note.controller");
const { readComment, readComments, createComment, deleteComment, updateComment, readCommentsByTabIds, getPrivateComments } = require("./controllers/comment.controller");
const { uploadImg } = require("./controllers/upload.controller");
const { updateServiceImgs } = require("./controllers/updateServiceImgs.controller");
const { hasRight, hasEnoughRight, canDelServices } = require("./controllers/verifyAccess.controller");
const { getAllCategories, deleteCategorieById, updateCategorieById, createCategorie } = require("./controllers/categorie.controller");
const { getCommandes, getCommande, updateCommande, deleteCommande, getCommandeByUserId, createCommande, groupCommandsByStatus, getCommandeByProvider } = require("./controllers/commande.controller");
const { createHistorique, getHistorique, updateHistorique, deleteHistorique } = require("./controllers/historique.controller");
const { createMessage, getConversations, createConversation, deleteMessage, updateMessage } = require("./controllers/message.controller");

class Service{
    constructor(x=0){
        this.currentUser= x;
    }
    
    //crud user
    async signUp(req, res){
        return await signUpUser(req, res);
    }

    async signUpArtisan_(req, res){
        return await signUpArtisan(req, res);
    }

    async signUpModerator_(req, res){
        const test = await hasRight(req, 3);
        if(test)
            return await signUpModerator(req, res);
    }

    async signIn_(req, res){
        return await signin(req, res);
    }

    async signout_(req, res){
        return await signout(req, res);
    }
    

    async getUsers_(req, res){
        return await getUsers(req, res);
    }

    async getUsersWithoutCustomer_(req, res){
        return await getUsersWithoutCustomer(req, res);
    }
    
    async getUsersAndNotification_(req, res) {
        return await getUsersAndNotification(req, res);
    }

    async getAdminInfo_(req, res){
        return await getAdminInfo(req, res);
    }
    
    

    async findUser_(req, res){
        return await findUser(req, res);
    }

    async updateUser_(req, res){
        return await updateUser(req, res);
    }

    async updateAvailability_(req, res){
        return await updateAvailability(req, res);
    }
    

    async deleteUser_(req, res){
        return await deleteUser(req, res);
    }

    //crud service
    async createService_(req, res){
        const test = await hasRight(req, 1);
        if(test)
            return await createService(req, res);
        else
            return res.status(400).json({ message: "Vous n'avez pas access à cette ressource."})
    }

    async copyServiceTo_(req, res){
        const test = await hasRight(req, 1);
        if(test)
            return await copyServiceTo(req, res);
        else
            return res.status(400).json({ message: "Vous n'avez pas access à cette ressource."})
    }
    

    async readService_(req, res){
        return await readService(req, res);
    }
    async readServiceByProviderId_(req, res){
        return await readServiceByProviderId(req, res);
    }
    

    async readServices_(req, res){
        return await readServices(req, res);
    }
    
    async searchServices_(req, res){
        return await searchServices(req, res);
    }

    async updateServiceImgs_(req, res){
        return await updateServiceImgs(req, res);
    }
    async updateService_(req, res){
        const test = await hasEnoughRight(req)
        console.log("test  ", test);
        if(test)
            return await updateService(req, res);
    }

    async deleteService_(req, res){
        console.log("test delete");
        const test = await hasEnoughRight(req)
        console.log("test delete", test);
        if(test)
            return await deleteService(req, res);
    }
    
    async deleteAllUserService_(req, res){
        const test = await canDelServices(req)
        if(test)
            return await deleteAllUserService(req, res);
    }

    async noteService(req, res){
        return await note(req, res);
    }
    async readServiceNotes_(req, res){
        return await readServiceNotes(req, res);
    }
    async readUserNotes_(req, res){
        return await readUserNotes(req, res);
    }
    
    async readAllNotes_(req, res){
        return await readNotes(req, res);
    }
    async deleteNote_(req, res){
        return await deleteNote(req, res);
    }


    //crud comment
    async createComment_(req, res){
        return await createComment(req, res);
    }
    
    async readComment_(req, res){
        return await readComment(req, res);
    }

    
    async getPrivateComments_(req, res){
        return await getPrivateComments(req, res);
    }


    async readComments_(req, res){
        return await readComments(req, res);
    }

    async updateComment_(req, res){
        await updateComment(req, res);
    }

    async deleteComment_(req, res){
        await deleteComment(req, res);
    }

    async readCommentsByTabIds_(req, res){
        await readCommentsByTabIds(req, res);
    }
    //crud order
    startOrder(req, res){

    }
    
    getOrder(req, res){

    }

    modifyOrder(req, res){

    }

    deleteOrder(req, res){

    }

    async createCategorie(req, res){
        await createCategorie(req,res);
    }

    async getCategories(req,res){
        await getAllCategories(req,res);
    }

    async getCategorie(req,res){
        await getCategorieById(req,res);
    }

    async updateCategorie(req,res){
        await updateCategorieById(req, res);
    }

    async deleteCategorie(req,res){
        await deleteCategorieById(req,res);
    }
    async favoriteService_(req, res){
        return await favorite(req, res);
    }
    async readFavoriteService_(req, res){
        return await findFavoriteService(req, res);
    }
    
    async addRoleForUser_(req, res){
        await addRoleForUser(req,res);
    }

    async findRole_(req, res){
        return await findRole(req, res);
    }

    async getRoles_(req, res){
        return await getRoles(req, res);
    }

    async updateRole_(req, res){
        await updateRole(req,res);
    }

    async deleteRole_(req, res){
        await deleteRole(req, res);
    }

    async sendMsg_(req, res){
        return await sendMsg(req, res);
    }

    async readMsg_(req, res){
        return await readMsg(req, res);
    }

    async readConversation_(req, res){
        return await readConversation(req, res);
    }

    async updateMessage_(req, res){
        return await updateMessage(req, res);
    }

    async deleteMessage_(req, res){
        return await deleteMessage(req, res);
    }

    async uploadImg_(req, res){
        return await uploadImg(req, res);
    }

    async createCommande_(req, res){
        return await createCommande(req, res);
    }

    async getCommandes_(req, res){
        return await getCommandes(req, res);
    }
    async groupCommandsByStatus(req, res){
        return await groupCommandsByStatus(req, res);
    }
    

    async getCommande_(req, res){
        return await getCommande(req, res);
    }

    async getCommandeByUserId_(req, res){
        return await getCommandeByUserId(req, res);
    }
    async getCommandeByProvider_(req, res){
        return await getCommandeByProvider(req, res);
    }
    
    async updateCommande_(req, res){
        return await updateCommande(req, res);
    }

    async deleteCommande_(req, res){
        return await deleteCommande(req, res);
    }

    async createHistorique_(req, res){
        return await createHistorique(req, res);
    }

    async getHistorique_(req, res){
        return await getHistorique(req, res);
    }

    async updateHistorique_(req, res){
        return await updateHistorique(req, res);
    }

    async deleteHistorique_(req, res){
        return await deleteHistorique(req, res);
    }

    async createMessage_(req, res){
        return await createMessage(req, res);
    }

    async createConversation_(req, res){
        return await createConversation(req, res);
    }

    async getConversations_(req, res){
        return await getConversations(req, res);
    }
}

module.exports = Service
