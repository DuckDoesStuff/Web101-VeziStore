const express = require('express');
const router = express.Router();
const productController = require('../../../src/product/product.controller');

const css_files = [
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
  'http://code.jquery.com/ui/1.10.3/jquery-ui.js',
  'assets/corporate/scripts/layout.js'
]

// Define the common data structure
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

// Function to generate data based on the route parameters
/* Default category is Woman. */

async function generateData(category, type, page) {
  const currentCategory = category.charAt(0).toUpperCase() + category.slice(1);
  const currentType = type ? type.charAt(0).toUpperCase() + type.slice(1) : null;
  const allProduct = currentType ? 
      await productController.getProductByCategoryAndSubcategory(category, type) : 
      await productController.getProductByCategory(category);
  const productData = allProduct.slice((page - 1) * 9, page * 9);
  return {
    title: currentCategory + (currentType ? ` ${currentType}` : '') + ' category | Metronic Shop UI',
    currentCategory: currentCategory,
    currentType: currentType,
    categories: categoriesData,
    css_files: css_files,
    js_files: js_files,
    productData: {...productData},
    productCount: productData.length,
    pages: Array.from({length: Math.ceil(allProduct.length / 9)}, (_, i) => ({
      page:i + 1,
      url: `/category/?cate=${category}${type ? `&type=${type}` : ''}&page=${i + 1}`
    })),
    curPage: page
  };
}

router.get('/', async function(req, res, next) {
  const cate = req.query.cate;
  const type = req.query.type;
  const page = req.query.page || 1;
  const data = await generateData(cate, type, page);
  res.render('user/category/productCategory', data);
});

module.exports = router;
