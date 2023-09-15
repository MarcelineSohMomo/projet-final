const { verifyToken } = require('../controllers/auth.controller');
const Service = require('../service');

const routes = require('express').Router();
const service = new Service();

routes.post("/", verifyToken, service.createConversation_);
routes.get("/:id", verifyToken, service.getConversations_);
routes.get("/support/:id", verifyToken, service.getConversations_);


module.exports = routes;