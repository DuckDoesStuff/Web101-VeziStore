const productService = require("./product.service");
const categoryService = require('../category/category.service');

const home = async (req,res,next) => {
	res.render("user/home", {
		title: "Vezi Store | Home",
		user: req.user,
		newProducts: await productService.getNewProducts(),
		saleProducts: await productService.getSaleProducts(),
		popularProducts: await productService.getPopularProducts(),
		categories: await categoryService.getAllCategory(),
		subcategories: await categoryService.getAllSubcategory(),
	});
}
exports.home = home;

const catalog = async (req,res,next) => {
	const page = req.query.page || 1;
	const sort = req.query.sort || 0;
	const num = 9;
	let products = await productService.getProductByCategoryAndSubcategory(req.query.cate, req.query.type);
	const productCount = await productService.countProductsByCategoryAndSubcategory(req.query.cate, req.query.type);
	switch (sort) {
		case 1:
			products = productService.sortProductsByTime(products);
			products.slice((page - 1) * num, (page - 1) * num + num);
			break;
		case 2:
			products = productService.sortProductsByPriceDes(products);
			products.slice((page - 1) * num, (page - 1) * num + num);
			break;
		case 3:
			products = productService.sortProductsByPriceAsc(products);
			products.slice((page - 1) * num, (page - 1) * num + num);
			break;
	}

	const popularProducts = await productService.getPopularProductsByCategoryAndSubcategory(req.query.cate, req.query.type);

	const currentCategory = req.query.cate.charAt(0).toUpperCase() + req.query.cate.slice(1);
	const currentType = req.query.type ? req.query.type.charAt(0).toUpperCase() + req.query.type.slice(1) : "";


	res.render("user/catalog", {
		title: "Vezi Store | " + currentCategory + " " + currentType + " | Catalog",
		user: req.user,
		categories: await categoryService.getAllCategory(),
		subcategories: await categoryService.getAllSubcategory(),
		currentCategory: currentCategory,
		currentType: currentType,
		sort: sort,
		products: products,
		popularProducts: popularProducts,
		currentPage: page,
		totalPages: Math.ceil(productCount / 9),
	});
}
exports.catalog = catalog;