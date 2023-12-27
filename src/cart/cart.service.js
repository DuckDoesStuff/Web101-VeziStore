const User = require('../user/user.model');
const Cart = require('./cart.model');
const Product = require('../product/product.model');

const addToCart = async (productId, quantity, userId) => {
	const user = await User.findById(userId);
	const cart = await Cart.findById(user.cart).populate("item.product");
	const index = cart.item.findIndex(item => item.product._id == productId);

	if (index > -1) {
		cart.item[index].quantity += parseInt(quantity);
		cart.item[index].total += quantity * cart.item[index].product.price;
		cart.total += quantity * cart.item[index].product.price;
	}else {
		const product = await Product.findById(productId).select("price");
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
	const cart = await Cart.findById(user.cart).populate("item.product");
	const index = cart.item.findIndex(item => item.product._id == productId);
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
	const user = await User.findById(userId);
	return await Cart.findById(user.cart).populate("item.product")
}
exports.getCart = getCart;

const updateCart = async (productId, quantity, userId) => {
	const user = await User.findById(userId);
	const cart = await Cart.findById(user.cart).populate("item.product");
	const index = cart.item.findIndex(item => item.product._id == productId);
	if (index > -1) {
		cart.total = cart.total - cart.item[index].total + quantity * cart.item[index].product.price;
		cart.item[index].quantity = quantity;
		cart.item[index].total = quantity * cart.item[index].product.price;
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