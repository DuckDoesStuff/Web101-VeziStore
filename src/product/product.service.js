const {Product} = require('./product.model');

const getAllProduct = async () => {
		const products = await Product.find().lean();
		return products;
}

const getProductById = async (id) => {
		const product = await Product.findById(id).lean();
		return product;
}

const getProductsByName = async (name) => {
  const products = await Product.find({ name: { $regex: new RegExp(name, 'i') } }).lean();
  return products;
}

const countProductsByCategoryAndSubcategory = async (category, subcategory) => {
	if (subcategory) {
		return await Product.countDocuments({
			category: {$in: [category]},
			subcategory: {$in: [subcategory]}
		});
	}else {
		return await Product.countDocuments({
			category: {$in: [category]}
		});
	}
}
exports.countProductsByCategoryAndSubcategory = countProductsByCategoryAndSubcategory;

const getProductByCategoryAndSubcategory = (category, subcategory) => {
	if (subcategory) {
		return Product.find({
						category: {$in: [category]},
						subcategory: {$in: [subcategory]},
					}).lean();
	}else {
		return Product.find({
						category: {$in: [category]},
					}).lean();
	}
}
exports.getProductByCategoryAndSubcategory = getProductByCategoryAndSubcategory;

const getPopularProductsByCategoryAndSubcategory = (category, subcategory, num = 3) => {
	if (subcategory) {
		return Product.find({
			category: {$in: [category]},
			subcategory: {$in: [subcategory]}
		}).sort({rating: -1}).limit(num).lean();
	}else {
		return Product.find({
			category: {$in: [category]}
		}).sort({rating: -1}).limit(num).lean();
	}
}
exports.getPopularProductsByCategoryAndSubcategory = getPopularProductsByCategoryAndSubcategory;

const getNewProducts = (num = 6) => Product.find().sort({createAt: -1}).limit(num).lean();
exports.getNewProducts = getNewProducts;

const getSaleProducts = async (num = 6) => Product.find({discount: {$gt: 0}}).sort({discount: -1}).limit(num).lean();
exports.getSaleProducts = getSaleProducts;

const getPopularProducts = async (num = 4) => Product.find().sort({rating: -1}).limit(num).lean();
exports.getPopularProducts = getPopularProducts;

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
		review: review,
	});
	return await newProduct.save();
}

const addReviewToProduct = async (id, review) => {
	const product = await Product.findById(id);
	product.review.push(review._id);
	product.rating = (product.rating * (product.review.length - 1) + review.rating) / product.review.length;
	await product.save();
}

const sortProductsByTime = (productData) => {
	const sortedProducts = [...productData];

	sortedProducts.sort((a, b) => {
	  const timeA = new Date(a.createAt).getTime();
	  const timeB = new Date(b.createAt).getTime();
	  return timeB - timeA;
	});
  
	return sortedProducts;
};
exports.sortProductsByTime = sortProductsByTime;

const sortProductsByPriceDes = (productData) => {
	const sortedProducts = [...productData];

	sortedProducts.sort((a, b) => {
		const priceA = a.price - a.discount;
		const priceB = b.price - b.discount;
		return priceB - priceA;
	});

	return sortedProducts;
};
exports.sortProductsByPriceDes = sortProductsByPriceDes;

const sortProductsByPriceAsc = (productData) => {
	const sortedProducts = [...productData];

	sortedProducts.sort((a, b) => {
		const priceA = a.price - a.discount;
		const priceB = b.price - b.discount;
		return priceA - priceB;
	});

	return sortedProducts;
};
exports.sortProductsByPriceAsc = sortProductsByPriceAsc;