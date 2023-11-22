const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
	name:String,
	image:[String],
	price:Number,
	discount:Number,
	availability: Number,
	category: {type: mongoose.Schema.Types.ObjectId, ref:'Category'},
	subcategory: {type: mongoose.Schema.Types.ObjectId, ref:'Subcategory'},
	size: [String],
	color: [String],
	rating: Number,
	description: [String],
	information: [String],
	review: [{type: mongoose.Schema.Types.ObjectId, ref:'Review'}],
});

const Product = mongoose.model('Product', productSchema, 'product');

const reviewSchema = new mongoose.Schema({
	username:String,
	date: Date,
	rating: Number,
	review: [String]
})

const Review = mongoose.model('Review', reviewSchema, 'review');

module.exports = {
	Product,
	Review
}