const express = require('express');
const router = express.Router();
const productController = require('../../../src/product/product.controller');

const generateData = async () => {
  const newestProducts = await productController.getNewProducts();
  const saleProducts = await productController.getSaleProducts();
  const popularProducts = await productController.getPopularProducts();
  const result = {
    title: 'Vezi Store | Home',
    newestProducts: {...newestProducts},
    saleProducts: {...saleProducts},
    popularProducts: {...popularProducts}
  };
  return result;
}

router.get('/', function(req, res, next) {
  generateData()
    .then(data => {
      res.render('user/home/shopHome', {...data, user: req.user});
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
