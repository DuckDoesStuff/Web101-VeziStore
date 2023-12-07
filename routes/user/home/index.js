const express = require('express');
const router = express.Router();

const productController = require('../../../src/product/product.controller');

router.get('/', productController.home);

module.exports = router;
