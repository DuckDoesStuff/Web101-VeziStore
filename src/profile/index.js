const express = require("express");
const router = express.Router();

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 5 }});

const profileController = require("./profile.controller");

router.get("/change-password", profileController.changePassword);
router.post("/change-password", profileController.updatePassword);

router.get("/", profileController.viewProfile);
router.post("/", profileController.updateProfile);
router.post("/upload-avatar", upload.single("image"), profileController.uploadAvatar);

module.exports = router;