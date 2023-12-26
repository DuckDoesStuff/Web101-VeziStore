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