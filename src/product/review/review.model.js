const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
	username:String,
	date: mongoose.Schema.Types.Date,
	rating: Number,
	review: String
})

const Review = mongoose.model('Review', reviewSchema, 'review');
module.exports = Review;