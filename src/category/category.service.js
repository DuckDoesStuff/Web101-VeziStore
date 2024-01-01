const Category = require('./category.model').Category;
const Subcategory = require('./category.model').Subcategory;

const getAllCategory = () => Category.find().lean();
exports.getAllCategory = getAllCategory;

const getAllSubcategory = () => Subcategory.find().lean();
exports.getAllSubcategory = getAllSubcategory;

const addProductToCategoryAndSubcategory = async (categoryName, subcategoryName, productId) => {
	categoryName = categoryName.slice(0, 1).toUpperCase() + categoryName.slice(1);
	const category = await Category.findOne({name: categoryName});
	category.product.push(productId);
	await category.save();
	subcategoryName = subcategoryName.slice(0, 1).toUpperCase() + subcategoryName.slice(1);

	const subcategory = await Subcategory.findOne({name: subcategoryName});
	subcategory.product.push(productId);
	await subcategory.save();
}
exports.addProductToCategoryAndSubcategory = addProductToCategoryAndSubcategory;
