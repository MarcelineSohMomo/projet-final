class Service{
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
  
}

export default Service