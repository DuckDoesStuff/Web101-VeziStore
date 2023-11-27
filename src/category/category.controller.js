const Category = require('./category.model').Category;
const Subcategory = require('./category.model').Subcategory;

const getAllCategory = async () => {
	const categories = await Category.find();
	return categories;
}

const getAllSubcategory = async () => {
	const subcategories = await Subcategory.find();
	return subcategories;
}

const addProductToCategoryAndSubcategory = async (categoryName, subcategoryName, productId) => {
	const category = await Category.findOne({name: categoryName});
	category.product.push(productId);
	await category.save();

	const subcategory = await Subcategory.findOne({name: subcategoryName});
	subcategory.product.push(productId);
	await subcategory.save();
}

module.exports = {
	getAllCategory,
	getAllSubcategory,
	addProductToCategoryAndSubcategory
}
