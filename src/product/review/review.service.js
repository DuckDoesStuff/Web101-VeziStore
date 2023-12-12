const {Review} = require('./review.model');
const productService = require('../product.service');
const moment = require('moment');

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
	let reviews = await getReviews(productDetail.review.map(review => review._id));
	reviews.sort((a, b) => b.date - a.date);
	reviews.forEach((review) => {
		review.date = moment(review.date).format('DD/MM/YYYY, h:mm:ss a');
	})
	// Sort reviews by date
	return reviews;
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