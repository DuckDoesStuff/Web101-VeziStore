const express = require('express');
const router = express.Router();

const productController = require('./product/product.controller');
const userController = require('./user/user.controller');

router.get('/', productController.home);
router.get('/signin', userController.signin);
router.get('/signup', userController.signup);

router.post('/signin', userController.login);
router.post('/signup', userController.register);
router.get('/logout', userController.logout);

module.exports = router;
