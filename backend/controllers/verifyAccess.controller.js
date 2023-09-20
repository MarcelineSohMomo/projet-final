const { ROLES, roleToNumber, User, Service } = require("../models");
const { getRoleForVerification } = require("./role.controller");
require('dotenv').config({ path: "../config/.env"});
const jwt = require("jsonwebtoken");

 module.exports.hasRightOver= async (firstId, secondId) =>{
    try {
        const firstRole =  await getRoleForVerification(firstId);
        const secondRole =  await getRoleForVerification(secondId);

        return  
    } catch (error) {
        
    }
}
module.exports.hasRight = async (req,num) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];
  if(!token)
      return res.status(403).send({ message: "Token non fourni !" });

  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.SECRET_CODE, async(err, decoded) =>{
      if (err) {
          return reject(new Error("Unauthorized!"));
      }

      const id = decoded.id;
      const user =  await User.findById(id).populate("roles", "value");

      for (let role of user.roles) {
        if(role.value > num){
          return resolve(true);
        }
      }

      resolve(false);
    })
  })
  
};

  
module.exports.hasEnoughRight = async (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];
  if(!token)
      return res.status(403).send({ message: "Token non fourni !" });

  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.SECRET_CODE, async(err, decoded) =>{
      if (err) {
          return reject(new Error("Unauthorized!"));
      }

      const id = decoded.id;
      const user =  await User.findById(id).populate("roles", "value");
      const service = await Service.findById(req.params.id);
      console.log("service ", service)
      const provider = await User.findById(service.providerId).populate("roles", "value");
      
      const highRoleForUser = user.roles.reduce((max, role) => {
        return role.value > max ? role.value : max;
      }, -Infinity);
      const highRoleForProvider = provider.roles.reduce((max, role) => {
        return role.value > max ? role.value : max;
      }, -Infinity);
      console.log("highRoleForUser ",highRoleForUser)
      console.log("highRoleForProvider ",highRoleForProvider)
      
      if(highRoleForUser >= highRoleForProvider){
        return resolve(true);
      }
      resolve(false);
    })
  })
};

module.exports.canDelServices = async (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];
  if(!token)
      return res.status(403).send({ message: "Token non fourni !" });

  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.SECRET_CODE, async(err, decoded) =>{
      if (err) {
          return reject(new Error("Unauthorized!"));
      }

      const id = decoded.id;
      if(id == req.params.id)
        return resolve(true);

      const user =  await User.findById(id).populate("roles", "value");
      const providerRole = await ROLES.findOne({name:'provider'});
      const isHigherThanProvider = user.roles.find((u)=>{
        return u.value > providerRole.value
      })
      
      if(!isHigherThanProvider)
        return resolve(false);
      
      resolve(true);
    })
  })

};

