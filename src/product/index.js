const express = require('express');
const router = express.Router();

const productController = require('./product.controller');
const reviewRouter = require('./review');

// Middleware to check if the user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/home/signin');
}

router.get('/search/', productController.search)
router.get('/:id', productController.detail);

router.post('/:id', ensureAuthenticated, productController.addToCart);
router.post('/api/', productController.getProducts);

router.use('/:id/reviews', reviewRouter);

router.get('/', productController.catalog);


module.exports = router;