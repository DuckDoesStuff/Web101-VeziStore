const reviewService = require("./review.service");

const getReview = async (req, res, next) => {
	const reviewData = await reviewService.getReviewByProductId(req.params.id);
  res.json(reviewData);
}
exports.getReview = getReview;