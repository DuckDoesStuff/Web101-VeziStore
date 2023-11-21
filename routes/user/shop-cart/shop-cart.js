const express = require('express');
const router = express.Router();

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
	'assets/corporate/css/custom.css',
];

const js_files = [
	'assets/plugins/fancybox/source/jquery.fancybox.pack.js',
	'assets/plugins/owl.carousel/owl.carousel.min.js',
	'assets/plugins/zoom/jquery.zoom.min.js',
	'assets/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
	'assets/plugins/uniform/jquery.uniform.min.js',
	'assets/plugins/rateit/src/jquery.rateit.js',
	'http://code.jquery.com/ui/1.10.3/jquery-ui.js',
	'assets/corporate/scripts/layout.js',
];

router.get('/', function(req, res, next) {
	res.render('user/shop-cart/shopCart', {title: 'Shopping cart | Shop UI', css_files: css_files, js_files: js_files})
});

module.exports = router;