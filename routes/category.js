const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('category', {title: 'Men category | Metronic Shop UI'});
});

module.exports = router;
