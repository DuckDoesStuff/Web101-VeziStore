const express = require('express');
const router = express.Router();

const userController = require('./user.controller');

router.post('/:id', userController.addToCart);
router.get('/:id', userController.getCart);

module.exports = router;