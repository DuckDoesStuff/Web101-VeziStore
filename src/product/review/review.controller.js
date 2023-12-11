const reviewService = require("./review.service");
const productService = require("../product.service");

const getReview = async (req, res, next) => {
	const reviewData = await reviewService.getReviewByProductId(req.params.id);
  res.json(reviewData);
}
exports.getReview = getReview;

const createReview = async (req, res, next) => {
	const username = req.user.username;
	const date = new Date();
	const rating = req.body.rating;
	const review = req.body.review;

	const newReview = await reviewService.createReview(username, date, rating, review);
	await productService.addReviewToProduct(req.params.id, newReview);
	res.status(201).json({ success: true, message: 'Review created successfully', review: newReview });
}
exports.createReview = createReview;