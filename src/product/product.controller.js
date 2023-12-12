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
	const currentCategory = req.query.cate.charAt(0).toUpperCase() + req.query.cate.slice(1);
	const currentType = req.query.type ? req.query.type.charAt(0).toUpperCase() + req.query.type.slice(1) : "";
	const popularProducts = await productService.getPopularProductsByCategoryAndSubcategory(req.query.cate, req.query.type);

	res.render("user/catalog", {
		title: "Vezi Store | " + currentCategory + " " + currentType + " | Catalog",
		user: req.user,
		categories: await categoryService.getAllCategory(),
		subcategories: await categoryService.getAllSubcategory(),
		currentCategory: currentCategory,
		currentType: currentType,
		popularProducts: popularProducts,
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
	});
}
exports.detail = detail;

const search = async (req,res,next) => {
	const term = req.query.term;

	res.render("user/catalog", {
		title: "Vezi Store | Search",
		user: req.user,
		categories: await categoryService.getAllCategory(),
		subcategories: await categoryService.getAllSubcategory(),
		currentCategory: "",
		currentType: "",
		searchName: term,
	});
}
exports.search = search;

const getProducts = async (req,res,next) => {
	const page = req.query.page || 1;
	const sort = req.query.sort || 0;
	const filter = req.query.filter || "";
	const category = req.query.cate || "";
	const subcategory = req.query.type || "";
	const term = req.query.term || "";
	res.json(await productService.getProducts(page, sort, filter, category, subcategory, term));
}
exports.getProducts = getProducts;