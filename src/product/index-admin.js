const express = require('express');
const router = express.Router();

const productController = require('./product.controller');

router.post('/dashboard/', productController.getProducts);

router.get('/dashboard/', productController.dashboard);

router.get('/dashboard/api/subcategories/:category', productController.getSubByCate);

module.exports = router;
