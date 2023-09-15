const { verifyToken } = require('../controllers/auth.controller');
const Service = require('../service');
const router = require('express').Router();

const service = new Service();


router.get("/", verifyToken, service.readAllNotes_);
router.get("/:id", verifyToken, service.readServiceNotes_);
router.get("/user/:id", verifyToken, service.readUserNotes_);
router.delete("/:id", verifyToken, service.deleteNote_);
router.patch("/", verifyToken, service.noteService);




module.exports = router;