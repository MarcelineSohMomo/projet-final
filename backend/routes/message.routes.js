const { verifyToken } = require('../controllers/auth.controller');
const Service = require('../service');

const routes = require('express').Router();
const service = new Service();

routes.post("/", verifyToken, service.createMessage_);
// routes.get("/:id", verifyToken, service.readMsg_);
routes.put("/:id", verifyToken, service.updateMessage_);
routes.delete("/:id", verifyToken, service.deleteMessage_);

module.exports = routes;