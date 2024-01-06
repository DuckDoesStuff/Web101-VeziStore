const User = require('../user/user.model');
const Cart = require('./cart.model');
const Product = require('../product/product.model');

const addToCart = async (productId, quantity, userId) => {
	const user = await User.findById(userId);
	const cart = await Cart.findById(user.cart);
	let index;
	try {
		index = cart.item.findIndex(item => item.product == productId);
	}catch(err) {
		console.log(err);
		index = -1;
	}

	const product = await Product.findById(productId).select("price");
	if (index > -1) {
		cart.item[index].quantity += parseInt(quantity);
		cart.item[index].total += quantity * product.price;
		cart.total += quantity * product.price;
	}else {
		const total = quantity * product.price;
		cart.total += total;
		cart.item.push({
			product: productId, 
			quantity: quantity,
			total: total
		});
	}
	await cart.save();
	return {
		message: "Product added to cart successfully",
		status: 200
	}
}
exports.addToCart = addToCart;

const removeFromCart = async (productId, userId) => {
	const user = await User.findById(userId);
	const cart = await Cart.findById(user.cart);
	const index = cart.item.findIndex(item => item.product == productId);
	if (index > -1) {
		cart.total -= cart.item[index].total;
		cart.item.splice(index, 1);
		await cart.save();
		return {
			message: "Product removed from cart successfully",
			status: 200
		}
	}else {
		return {
			message: "Product not found in cart",
			status: 404
		}
	}
}
exports.removeFromCart = removeFromCart;

const getCart = async (userId) => {
	try {
		const user = await User.findById(userId);
		if(!user) {
			return {
				message: "User not found",
				status: 404
			}
		}
		const cart = await Cart.findById(user.cart).populate("item.product");
		if(!cart) {
			const newCart = new Cart({
				item: [],
				total: 0
			});
			await newCart.save();
			user.cart = newCart.id;
			user.save();
			return cart;
		}
		const filteredCart = cart.item.filter(item => item.product != null);
		if (filteredCart.length < cart.item.length) {
			cart.total = filteredCart.reduce((acc, item) => acc + item.total, 0);
			cart.item = filteredCart;
			cart.save();
		}
		return cart;
	}
	catch(err) {
		console.log(err);
	}
}
exports.getCart = getCart;

const updateCart = async (productId, quantity, userId) => {
	const user = await User.findById(userId);
	const cart = await Cart.findById(user.cart);
	const index = cart.item.findIndex(item => item.product == productId);
	if (index > -1) {
		const product = await Product.findById(productId);
		cart.total = cart.total - cart.item[index].total + quantity * product.price;
		cart.item[index].quantity = quantity;
		cart.item[index].total = quantity * product.price;
		await cart.save();
		return {
			message: "Cart updated successfully",
			status: 200
		}
	}
	else {
		return {
			message: "Product not found in cart",
			status: 404
		}
	}
}
exports.updateCart = updateCart;