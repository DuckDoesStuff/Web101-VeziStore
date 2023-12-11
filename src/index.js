const express = require('express');
const router = express.Router();

const productController = require('./product/product.controller');

router.get('/', productController.home);

module.exports = router;
