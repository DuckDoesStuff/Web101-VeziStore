const express = require('express');
const router = express.Router();

const userController = require('./user.controller');

router.post('/dashboard/', userController.getUsers);

router.get('/dashboard/', userController.dashboard);

router.get('/:id', userController.userDetail);

module.exports = router;
