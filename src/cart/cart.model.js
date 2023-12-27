const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
	item: [{
		product: {type: mongoose.Schema.Types.ObjectId, ref:'Product'},
		quantity: Number,
		total: Number
	}],
	total: Number
});

const Cart = mongoose.model('Cart', cartSchema, 'cart');
module.exports = Cart;