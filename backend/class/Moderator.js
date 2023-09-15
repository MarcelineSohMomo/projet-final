const { getAllServices, createService, updateService, deleteService } = require("../controllers/CRUD/Service.CRUD");
const User = require("./User");

class Moderator extends User {
    constructor(props) {
      super(props);
    }
  
    async createCustomer(userId, customerData,moderatorId) {
      await super.signUp(customerData);
    }

    async updateCustomer(CustomerId, CustomerData) {
      return await this.updateUser(CustomerId, CustomerData)
    }

    async deleteCustomer(CustomerId, currentId) {
      return await this.deleteUser(CustomerId, currentId)
    }

    async getCustomer(CustomerId) {
      return await this.findUserById(CustomerId);
    }


    async createProvider(userId, providerData,moderatorId) {
      await createUser(providerData);
      await addRoleToUser(userId, role='provider', moderatorId);
    }
  
    async getprovider (providerId) {
      return await this.findUserById(providerId);
    }

    async updateProvider(providerId, providerData) {
      return await this.updateUser(providerId, providerData)
    }

    async deleteProvider(providerId, currentId) {
      return await this.deleteUser(providerId, currentId)
    }

    async getArtisan(artisanId) {
      return await this.findUserById(artisanId);
    }
  
    updateArtisan(artisanId, artisanData) {
      return this.update(artisanId, artisanData);
    }
  
    async deleteArtisan(artisanId, currentId) {
      return await this.deleteUser(artisanId, currentId)
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
  
    async getStatistics() {
      return await getMostPurchasedServices();
    }

    async getCommentsByServiceId() {
      return await  getCommentsByServiceId(serviceId);
    }
  }

module.exports ={ Moderator };
