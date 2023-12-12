const express = require('express');
const router = express.Router();

const productController = require('./product.controller');
const reviewRouter = require('./review');

router.get('/search/', productController.search)
router.get('/:id', productController.detail);
router.use('/:id/reviews', reviewRouter);
router.get('/', productController.catalog);

router.post('/api/', productController.getProducts);


module.exports = router;