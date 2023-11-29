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

const getProductByCategory = async (category) => {
	const products = await Product.find({
												category: {$in: [category]}
											});
	return products;
}

const getProductBySubcategory = async (subcategory) => {
	const products = await Product.find({
												subcategory: {$in: [subcategory]}
											});
	return products;
}

const getProductByCategoryAndSubcategory = async (category, subcategory) => {
	const products = await Product.find({
												category: {$in: [category]},
												subcategory: {$in: [subcategory]}
											});
	return products;
}

const getReviewByID = async (id) => {
	const review = await Review.findById(id);
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
	await newReview.save();
}

const updateProductReview = async (id, review) => {
	const product = await Product.findById(id);
	product.review.push(review);
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
	getProductByCategory,
	getProductBySubcategory,
	getProductByCategoryAndSubcategory,
	getReviewByID,
	createProduct,
	createReview,
	updateProductReview,
	updateProduct
}