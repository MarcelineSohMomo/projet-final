const multer =  require('multer');
const { verifyToken } = require('../controllers/auth.controller');
const Service =  require('../service');
const router = require('express').Router();
const upload = multer({ dest: '../client/public/uploads/profil'});

const service = new Service();


router.get("/", verifyToken, service.getUsers_);
router.get("/without-customer", verifyToken, service.getUsersWithoutCustomer_);
router.get("/admin", verifyToken, service.getAdminInfo_);
router.get("/:id", verifyToken, service.findUser_);
router.delete("/:id", verifyToken, service.deleteUser_);
router.put("/:id", verifyToken, service.updateUser_);
router.get("/notification/:id", verifyToken, service.getUsersAndNotification_);
router.put("/update-availability/:id", verifyToken, service.updateAvailability_);
router.put("/reset-password/:id", verifyToken, service.resetPassword_);


router.post("/upload/:id", verifyToken, upload.single("file"), service.uploadImg_);


module.exports = router;