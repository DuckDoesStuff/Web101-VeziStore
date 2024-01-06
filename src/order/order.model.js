const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
	user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
	first_name: {type: String, required: true},
	last_name: {type: String, required: true},
	phone: {type: String, required: true},
	email: {type: String, required: true},
	address: {type: String, required: true},
	shipping: {type: String, required: true},
	payment: {type: String, required: true},
	total: {type: Number, required: true},
	item: [{
		product:{type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
		quantity: Number,
		total: Number
	}],
	status: {type: String, required: true},
	createdAt: {type: Date, default: Date.now(), required: true},
});

const Order = mongoose.model('Order', orderSchema, "order");
module.exports = Order;