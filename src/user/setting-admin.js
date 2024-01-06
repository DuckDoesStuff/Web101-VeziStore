const express = require('express');
const router = express.Router();

const userController = require('./user.controller');
const profileController = require('../profile/profile.controller');

router.get('/profile/', userController.adminProfile);

router.post('/profile/', profileController.updateProfile);


module.exports = router;