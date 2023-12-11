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
	const filter = req.query.filter || "";

	let products = await productService.getProductByCategoryAndSubcategory(req.query.cate, req.query.type);
	products = productService.sortProducts(products, sort);
	products = productService.filterProducts(products, filter);

	let productCount = 0;
	if (filter !== "") {
		productCount = products.length;
	}else {
		productCount = await productService.countProductsByCategoryAndSubcategory(req.query.cate, req.query.type);
	}
	products = products = products.slice((page - 1) * 9, (page - 1) * 9 + 9);

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
		filter: filter,
		products: products,
		popularProducts: popularProducts,
		currentPage: page,
		totalPages: Math.ceil(productCount / 9),
	});
}
exports.catalog = catalog;

const detail = async (req,res,next) => {
	const productDetail = await productService.getProductById(req.params.id);
	const similarProducts = await productService.getPopularProductsByCategoryAndSubcategory(productDetail.category, productDetail.subcategory);
	const popularProducts = await productService.getPopularProducts(6);
	res.render("user/productDetail", {
		title: "Vezi Store | " + productDetail.category + " " + productDetail.subcategory + " | Catalog",
		user: req.user,
		categories: await categoryService.getAllCategory(),
		subcategories: await categoryService.getAllSubcategory(),
		currentCategory: productDetail.category[0],
		currentType: productDetail.subcategory[0],
		similarProducts: similarProducts,
		productDetail: productDetail,
		popularProducts: popularProducts,
		// message: "This one is from server"
	});
}
exports.detail = detail;

const search = async (req,res,next) => {
	const term = req.query.term;
	const page = req.query.page || 1;
	const sort = req.query.sort || 0;
	const filter = req.query.filter || "";

	let products = await productService.getProductsByName(term);
	const productCount = products.length;
	products = productService.sortProducts(products, sort);
	products = productService.filterProducts(products, filter);

	products = products = products.slice((page - 1) * 9, (page - 1) * 9 + 9);
	const popularProducts = await productService.getPopularProducts(3);

	res.render("user/catalog", {
		title: "Vezi Store | Search",
		user: req.user,
		categories: await categoryService.getAllCategory(),
		subcategories: await categoryService.getAllSubcategory(),
		currentCategory: "",
		currentType: "",
		sort: sort,
		filter: filter,
		currentPage: page,
		totalPages: Math.ceil(productCount / 9),
		searchName: term,
		products: products,
		popularProducts: popularProducts,
	});
}

exports.search = search;