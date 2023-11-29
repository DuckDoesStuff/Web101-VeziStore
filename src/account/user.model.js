const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	username: String,
	email: String,
	password: String,
	wishlist: [{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}],
	shopcart: [{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}],
	checkout_history: [],
	order_history: []
});

const User = mongoose.model('User', UserSchema, 'user');

module.exports = User;