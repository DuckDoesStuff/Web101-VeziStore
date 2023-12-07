const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
	name:String,
	image:[String],
	price:Number,
	discount:Number,
	availability: Number,
	category: [String],
	subcategory: [String],
	size: [String],
	color: [String],
	rating: Number,
	description: [String],
	information: [String],
	review: [{type: mongoose.Schema.Types.ObjectId, ref:'Review'}],
	createAt: { type: Date, default: Date.now() }
});

const Product = mongoose.model('Product', productSchema, 'product');
exports.Product = Product;