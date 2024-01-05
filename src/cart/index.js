const express = require('express');
const router = express.Router();

const cartController = require('./cart.controller');

router.post('/:id', cartController.addToCart);
router.delete('/:id', cartController.removeFromCart);
router.put('/:id', cartController.updateCart);

router.get('/checkout', cartController.viewCheckout);
// router.post('/checkout', cartController.checkout);

router.get('/api', cartController.getCart);
router.get('/', cartController.viewCart);

module.exports = router;