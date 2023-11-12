const express = require('express');
const router = express.Router();

const css_files =[
  'assets/plugins/fancybox/source/jquery.fancybox.css',
  'assets/plugins/owl.carousel/assets/owl.carousel.css',
  'assets/plugins/uniform/css/uniform.default.css',
  'http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css',
  'assets/plugins/rateit/src/rateit.css',
  'assets/pages/css/components.css',
  'assets/corporate/css/style.css',
  'assets/pages/css/style-shop.css',
  'assets/corporate/css/style-responsive.css',
  'assets/corporate/css/themes/red.css',
  'assets/corporate/css/custom.css'
]

const js_files = [
  'assets/plugins/fancybox/source/jquery.fancybox.pack.js',
  'assets/plugins/owl.carousel/owl.carousel.min.js',
  'assets/plugins/zoom/jquery.zoom.min.js',
  'assets/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
  'assets/plugins/uniform/jquery.uniform.min.js',
  'assets/plugins/rateit/src/jquery.rateit.js',
  'assets/corporate/scripts/layout.js'
]

// Define the common data structure
const categoriesData = [
  {
    name: 'Man',
    types: ["T-Shirts", "Shirts", "Bottoms", "Outterwear", "Footwear"]
  },
  {
    name: 'Woman',
    types: ["Tops", "Dresses", "Activewear", "Accessories", "Footwear"]
  },
  {
    name: 'Kids',
    types: ["Sleepwear", "School", "Activity", "Summer"]
  }
];

// Function to generate data based on the route parameters
function generateData(category, type = null) {
  const currentCategory = category.charAt(0).toUpperCase() + category.slice(1);
  const currentType = type ? type.charAt(0).toUpperCase() + type.slice(1) : null;

  return {
    title: currentCategory + (currentType ? ` ${currentType}` : '') + ' category | Metronic Shop UI',
    currentCategory: currentCategory,
    currentType: currentType,
    categories: categoriesData,
    css_files: css_files,
    js_files: js_files
  };
}

router.get('/', function(req, res, next) {
  const data = generateData('Woman');
  res.render('product-detail', data);
});

module.exports = router;
