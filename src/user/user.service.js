const User = require('./user.model');

const addToCart = async (productId, quantity, userId) => {
	var user = await User.findById(userId);
	const existingProduct = user.shopcart.find(product => {
		if(product.productId == productId) {
			product.quantity += Number(quantity);
			return true;
		}
	});

	if (!existingProduct) {
		user.shopcart.push({
			"productId":productId, 
			"quantity":quantity
		});
	}
	await User.findByIdAndUpdate(userId, user);
	return {
		message: "Product added to cart successfully",
		status: 200
	}
}
exports.addToCart = addToCart;

const removeFromCart = async (productId, userId) => {
	const user = await User.findById(userId);
	const index = user.shopcart.findIndex(product => product.productId == productId);
	if (index > -1) {
		user.shopcart.splice(index, 1);
		await user.save();
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
	const user = await User.findById(userId).populate("shopcart.productId");
	let shopcart = user.shopcart;
	shopcart = shopcart.map(order => {
		const total = order.productId.price * order.quantity;
		return {order, total}
	});
	return shopcart;
}
exports.getCart = getCart;

const updateCart = async (productId, quantity, userId) => {
	const user = await User.findById(userId);
	const index = user.shopcart.findIndex(product => product.productId == productId);
	if (index > -1) {
		user.shopcart[index].quantity = quantity;
		await user.save();
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