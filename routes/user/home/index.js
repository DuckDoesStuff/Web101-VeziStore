const express = require('express');
const router = express.Router();

const css_files = [
  'assets/pages/css/animate.css',
  'assets/plugins/fancybox/source/jquery.fancybox.css',
  'assets/plugins/owl.carousel/assets/owl.carousel.css',
  'assets/pages/css/components.css',
  'assets/pages/css/slider.css',
  'assets/pages/css/style-shop.css',
  'assets/corporate/css/style.css',
  'assets/corporate/css/style-responsive.css',
  'assets/corporate/css/themes/red.css',
  'assets/corporate/css/custom.css'
];

const js_files = [
  'assets/plugins/fancybox/source/jquery.fancybox.pack.js',
  'assets/plugins/owl.carousel/owl.carousel.min.js',
  'assets/plugins/zoom/jquery.zoom.min.js',
  'assets/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
  'assets/corporate/scripts/layout.js',
  'assets/pages/scripts/bs-carousel.js'
]

const categoriesData = [
  {
    name: 'Woman',
    types: ["Tops", "Dresses", "Activewear", "Accessories", "Footwear"]
  },
  {
    name: 'Man',
    types: ["T-Shirts", "Shirts", "Bottoms", "Outterwear", "Footwear"]
  },
  {
    name: 'Kids',
    types: ["Sleepwear", "School", "Activity", "Summer"]
  }
];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('user/home/shopHome', {title: 'Metronic Shop UI', css_files: css_files, js_files: js_files, categories:categoriesData});
});

module.exports = router;
