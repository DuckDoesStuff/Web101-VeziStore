const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	username: String,
	email: String,
	password: String,
	wishlist: [],
	checkout_history: [],
	order_history: []
});

const User = mongoose.model('User', UserSchema);

module.exports = User;