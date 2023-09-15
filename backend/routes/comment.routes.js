const routes = require('express').Router();
const { verifyToken } = require('../controllers/auth.controller');
const Service = require('../service');
const service = new Service();

routes.post("/", verifyToken, service.createComment_);
routes.get("/", verifyToken, service.readComments_);
routes.get("/private/:id", verifyToken, service.getPrivateComments_);
routes.post("/ids", verifyToken, service.readCommentsByTabIds_);
routes.get("/:id", verifyToken, service.readComment_);
routes.put("/:id", verifyToken, service.updateComment_);
routes.delete("/:id", verifyToken, service.deleteComment_);

module.exports = routes;