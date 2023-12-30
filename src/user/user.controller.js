const categoryService = require("../category/category.service");


const profile = async (req, res, next) => {
	res.render("user/profile/profile", {
		title: "Profile",
		user: req.user,
		categories: await categoryService.getAllCategory()
	});
}
exports.profile = profile;