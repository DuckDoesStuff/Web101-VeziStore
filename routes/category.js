const express = require('express');
const router = express.Router();

const defaultCategory = 'Ladies';
const data = {
  title: defaultCategory +' category | Metronic Shop UI',
  currentCategory: defaultCategory,
  categories: [
    {
      name:'Men',
      types: ["T-Shirts", "Shirts", "Bottoms", "Outterwear", "Footwear"]
    },
    {
      name:'Ladies',
      types: ["Tops", "Dresses", "Activewear", "Accessories", "Footwear"]
    },
    {
      name:'Kids',
      types: ["Sleepwear", "School", "Activity", "Summer"]
    }
  ],
}

/* Default category is Ladies. */
router.get('/', function(req, res, next) {
  res.render('category', data);
});

module.exports = router;
