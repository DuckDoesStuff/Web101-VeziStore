const Product = require('./product.model').Product;
const Review = require('./product.model').Review;

const getAllProduct = async () => {
		const products = await Product.find().lean();
		return products;
}

const getProductById = async (id) => {
		const product = await Product.findById(id).lean();
		return product;
}

const getProductByName = async (name) => {
		const product = await Product.find({name: name}).lean();
		return product;
}

const getProductByCategoryAndSubcategory = async (category, subcategory) => {
	if (subcategory) {
		return await Product.find({
												category: {$in: [category]},
												subcategory: {$in: [subcategory]}
											}).lean();
	}else {
		return await Product.find({
												category: {$in: [category]}
											}).lean();
	
	}
}

const getBestsellerProductsInCategory = async (category, subcategory) => {
	if (subcategory) {
		return await Product.find({
			category: {$in: [category]},
			subcategory: {$in: [subcategory]}
		}).sort({rating: -1}).limit(3).lean();
	}else {
		return await Product.find({
			category: {$in: [category]}
		}).sort({rating: -1}).limit(3).lean();
	}
}

const getNewProducts = async () => {
	const products = await Product.find().sort({_id: -1}).limit(7).lean();
	return products;
}

const getSaleProducts = async () => {
	const products = await Product.find({discount: {$gt: 0}}).sort({discount: -1}).limit(6).lean();
	return products;
}

const getPopularProducts = async (num = 4) => {
	const products = await Product.find().sort({rating: -1}).limit(num).lean();
	return products;
}

const getReviewByID = async (id) => {
	const review = await Review.findById(id).lean();
	return review;
}

const createProduct = async (name, image, price, discount, availability, category, subcategory, size, color=[], rating=0, description, information, review=[]) => {
	const newProduct = new Product({
		name: name,
		image: image,
		price: price,
		discount: discount,
		availability: availability,
		category: category,
		subcategory: subcategory,
		size: size,
		color: color,
		rating: rating,
		description: description,
		information: information,
		review: review
	});
	return await newProduct.save();
}

const createReview = async (username, date, rating, review) => {
	const newReview = new Review({
		username: username,
		date: date,
		rating: rating,
		review: review
	});
	return await newReview.save();
}

const addReviewToProduct = async (id, review) => {
	const product = await Product.findById(id);
	product.review.push(review._id);
	product.rating = (product.rating * (product.review.length - 1) + review.rating) / product.review.length;
	await product.save();
}

const updateProduct = async (id, name, image, price, discount, availability, category, subcategory, size, color, rating, description, information, review) => {
	const product = await Product.findById(id);
	product.name = name;
	product.image = image;
	product.price = price;
	product.discount = discount;
	product.availability = availability;
	product.category = category;
	product.subcategory = subcategory;
	product.size = size;
	product.color = color;
	product.rating = rating;
	product.description = description;
	product.information = information;
	product.review = review;
	await product.save();
}

module.exports = {
	getAllProduct,
	getProductById,
	getProductByName,
	getProductByCategoryAndSubcategory,
	getBestsellerProductsInCategory,
	getNewProducts,
	getSaleProducts,
	getPopularProducts,
	getReviewByID,
	createProduct,
	createReview,
	addReviewToProduct,
	updateProduct
}