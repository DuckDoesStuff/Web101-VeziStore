const categoryService = require("../category/category.service");
const productService = require("../product/product.service");
const cartService = require("./cart.service");
const User = require("../user/user.model");

const addToCart = async(req,res,next) => {
	const productId = req.params.id;
	const quantity = req.body.quantity;
	// Check if the user is logged in
	if (!req.user) {
		return res.json({status: "error", message: "Please login first"});
	}

	// Check for available stock
	let product = await productService.getProductById(productId);
	if (product.availability < quantity) {
		return res.json({status: "error", message: "Not enough stock"});
	}

	// Add to cart
	const result = await cartService.addToCart(productId, quantity, req.user.id);
	return res.json(result);
}
exports.addToCart = addToCart;

const getCart = async (req, res, next) => {
	if(!req.user.id) {
		return res.json({status: "error", message: "Please login first"});
	}
	return res.json(await cartService.getCart(req.user.id));
}
exports.getCart = getCart;

const viewCart = async (req, res, next) => {
	if(!req.user) {
		return res.redirect("/signin/?returnUrl=cart");
	}

	res.render("user/cart/shopCart", {
		title: "Shopping cart",
		user: req.user, 
		categories: await categoryService.getAllCategory(),
		subcategories: await categoryService.getAllSubcategory()
	});
}
exports.viewCart = viewCart;

const removeFromCart = async (req, res, next) => {
	const productId = req.params.id;
	const result = await cartService.removeFromCart(productId, req.user.id);
	return res.json(result);
}
exports.removeFromCart = removeFromCart;

const updateCart = async (req, res, next) => {
	const productId = req.params.id;
	const quantity = req.body.quantity;
	const result = await cartService.updateCart(productId, quantity, req.user.id);
	return res.json(result);
}
exports.updateCart = updateCart;

const viewCheckout = async (req, res, next) => {
	if(!req.user) {
		return res.redirect("/auth/signin/?returnUrl=user/cart/checkout");
	}
	const user = await User.findById(req.user.id).select("first_name last_name address email phone")
	res.render("user/cart/checkout", {
		title: "Checkout",
		user: req.user,
		firstName: user.first_name,
		lastName: user.last_name,
		address: user.address,
		email: user.email,
		phone: user.phone,
	});
}
exports.viewCheckout = viewCheckout;