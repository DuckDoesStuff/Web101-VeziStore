const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
	name:String,
	subcategory:[String]
});

const Category = mongoose.model('Category', categorySchema, 'category');

const subcategorySchema = new mongoose.Schema({
	name:String,
	product:[{type: mongoose.Schema.Types.ObjectId, ref:'Product'}]
})

const Subcategory = mongoose.model('Subcategory', subcategorySchema, 'subcategory');

module.exports = {
	Category,
	Subcategory
}