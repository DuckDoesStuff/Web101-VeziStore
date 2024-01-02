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
	rating: {type:Number, default: 0.0},
	description: [String],
	information: [String],
	review: [{type: mongoose.Schema.Types.ObjectId, ref:'Review'}],
	createAt: { type: Date, default: Date.now() }
});

const Product = mongoose.model('Product', productSchema, 'product');
module.exports = Product;