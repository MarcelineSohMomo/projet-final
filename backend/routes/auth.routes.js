const { verifyToken } = require('../controllers/auth.controller');
const Service =  require('../service');
const router = require('express').Router();

const service = new Service();


router.post("/signup", service.signUp);
router.post("/signup-artisan", service.signUpArtisan_);
router.post("/signup-moderator", service.signUpModerator_);
router.post("/signin", service.signIn_);
router.post("/new-pasword", service.changePassword_);
router.put("/signout/:id", verifyToken, service.signout_);

module.exports = router;
