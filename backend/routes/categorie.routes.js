// categorieRoutes.js
const express = require('express');
const Service = require('../service');
const router = express.Router();
const service = new Service();
router.post('/', service.createCategorie);
router.get('/', service.getCategories);
router.get('/:id', service.getCategorie);
router.put('/:id', service.updateCategorie);
router.delete('/:id', service.deleteCategorie);

module.exports = router;
