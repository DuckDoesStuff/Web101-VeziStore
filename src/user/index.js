const express = require('express');
const router = express.Router();

const userController = require('./user.controller');

router.post('/:id', userController.addToCart);
router.delete('/:id', userController.removeFromCart);
router.put('/:id', userController.updateCart);
// router.post('/checkout', userController.checkout);
router.get('/api', userController.getCart);
router.get('/', userController.viewCart);

module.exports = router;