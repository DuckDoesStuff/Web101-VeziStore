const Review = require('./review.model');

const getReviewByID = async (id) => {
	const review = await Review.findById(id).lean();
	return review;
}
exports.getReviewByID = getReviewByID;

const createReview = async (username, date, rating, review) => {
	const newReview = new Review({
		username: username,
		date: date,
		rating: rating,
		review: review
	});
	return await newReview.save();
}
exports.createReview = createReview;