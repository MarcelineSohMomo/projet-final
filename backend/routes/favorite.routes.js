const Service = require('../service');
const { verifyToken } = require('../controllers/auth.controller');
const routes = require('express').Router();
const service = new Service();

routes.patch("/:id", verifyToken, service.favoriteService_);

module.exports = routes;
