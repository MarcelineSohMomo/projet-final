const { verifyToken } = require('../controllers/auth.controller');
const Service = require('../service');
const router = require('express').Router();

const service = new Service();


router.get("/", verifyToken, service.getRoles_);
router.get("/:id", verifyToken, service.findRole_);
router.post("/:id", verifyToken, service.addRoleForUser_);
router.delete("/:id", verifyToken, service.deleteRole_);
router.put("/:id", verifyToken, service.updateRole_);




module.exports = router;