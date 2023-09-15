const { getAllServices, createService, updateService, deleteService } = require("../controllers/CRUD/Service.CRUD");
const User = require("./User");

class Provider extends User {
    constructor(firstName, lastName, email, phone, img, dateOfBirth, description, password, isVerifed, languages, postes, certifications, qualification, roles, listServices, listNotes, listComments, listCompteBancaire, conversations) {
      super(firstName, lastName, email, phone, img, dateOfBirth, description, password, isVerifed, languages, postes, certifications, qualification, roles, listServices, listNotes, listComments, listCompteBancaire, conversations);
    }
  
  
    async getCustomer(customerId) {
      return await this.findUserById(customerId);
    }
  
    async getprovider (providerId) {
      return await this.findUserById(providerId);
    }


    async getService(serviceId, userId){
      return await getServiceById(serviceId, userId);
    }
  
    async getServices() {
      return await getAllServices();
    }

    async createServices(userId, serviceData) {
      return await createService(userId, serviceData);
    }

    async updateService(serviceId, serviceData, userId) {
      return await updateService(serviceId, serviceData, userId);
    }

    async deleteService(serviceId, userId){
      return await deleteService(serviceId, userId)
    }
    
  
    async getComments() {
      await displayComments();
    }

    async commentService(serviceId, user_id, message) {
        return await createComment(serviceId, user_id, message);
    }
  
    async getStatistics() {
      return await getMostPurchasedServices();
    }

    async getCommentsByServiceId() {
      return await  getCommentsByServiceId(serviceId);
    }


    async updateCommentService(commentId, message, userId){
        return await updateComment(commentId, message, userId);
    }
    
    async deleteCommentService(commentId, userId){
        return await deleteComment(commentId, userId);
    }
    
  }
module.exports = {Provider};