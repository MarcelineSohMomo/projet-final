const express = require('express');
const router = express.Router();
const Service = require('../service');
const service = new Service();

router.post('/', service.createHistorique_);
router.get('/:id', service.getHistorique_);
router.put('/:id', service.updateHistorique_);
router.delete('/:id', service.deleteHistorique_);

module.exports = router;
