const express = require('express');
const Service = require('../service');
const router = express.Router();

const service = new Service()
router.post('/', service.createCommande_);
router.get('/', service.getCommandes_);
router.get('/:id', service.getCommande_);
router.get('/me/:id', service.getCommandeByUserId_);
router.get('/client/:id', service.getCommandeByProvider_);
router.get('/provider/commands-by-status/:id', service.groupCommandsByStatus);
router.put('/:id', service.updateCommande_);
router.delete('/:id', service.deleteCommande_);

module.exports = router;
