const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
	user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
	address: {type: String, required: true},
	phone: {type: String, required: true},
	payment: {
		type: String,
		required: true
	},
	status: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now(),
		required: true
	}
});