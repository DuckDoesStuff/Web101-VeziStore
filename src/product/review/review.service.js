const {Review} = require('./review.model');
const productService = require('../product.service');

const getReviewByID = (id) => Review.findById(id).lean();

const getReviews = (ids) => Promise.all(ids.map((id) => getReviewByID(id)));

const getReviewByProductId = async (productId) => {
  //const productDetail = await productService.getProductById(productId);
  const productDetail = await productService.getProductById(productId);
	if (!productDetail) {
		return null;
	}
	if(!productDetail.review) {
		return [];
	}
  return getReviews(productDetail.review.map(review => review._id))
}
exports.getReviewByProductId = getReviewByProductId;

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