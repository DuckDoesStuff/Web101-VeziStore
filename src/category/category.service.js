const Category = require('./category.model').Category;
const Subcategory = require('./category.model').Subcategory;

const getAllCategory = () => Category.find().lean();
exports.getAllCategory = getAllCategory;

const getAllSubcategory = () => Subcategory.find().lean();
exports.getAllSubcategory = getAllSubcategory;

const addProductToCategoryAndSubcategory = async (categoryName, subcategoryName, productId) => {
	const category = await Category.findOne({name: categoryName});
	category.product.push(productId);
	await category.save();

	const subcategory = await Subcategory.findOne({name: subcategoryName});
	subcategory.product.push(productId);
	await subcategory.save();
}
