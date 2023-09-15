const { deleteUser, getAllUsers, createUser, addRoleToUser, findUserByEmail, updateUserByAdmin, deleteServiceAndRelatedComments } = require("../controllers/CRUD/Admin.CRUD");
const User = require("./User");


class Admin extends User {
    constructor(props) {
      super(props);
    }
  
    async readAllUser(){
      await getAllUsers();
    }
    // Méthodes spécifiques aux administrateurs
    async createManager(managerData, userId,adminId) {
      await createUser(managerData);
      await addRoleToUser(userId, role='moderator', adminId);
    }
  
    async getManager(managerId) {
      return await this.findUserById(managerId);
    }
  
    async updateManager(adminId, managerId, managerData) {
      return await updateUserByAdmin(adminId, managerId, managerData);
    }
  
    async deleteManager(managerId, currentUser) {
      return await deleteUser(managerId, currentUser);
    }

    async deleteServiceAndComments(serviceId, userId){
      return await deleteServiceAndRelatedComments(serviceId, userId);
    }

    async  addRoles(userId, role, adminId){
      return await addRoleToUser(userId, role, adminId);
    }
  }

  module.exports={
    Admin
  } 



module.exports = Admin;