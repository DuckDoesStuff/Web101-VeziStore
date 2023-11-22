const User = require('./users.model');

const getUsers = async(req, res) => {
	const users = await User.find();
	return users;
}

const getUserByID = async(req, res) => {
	const { id } = req.params;
	const user = await User.findById(id);
	return user;
}

const getUserByEmail = async (req, res) => {
	const { email } = req.params;
	const user = await User.findOne({ email });
	return user;
}

const addUser = async(req, res) => {
	const { username, email, password } = req.body;
	const user = new User({
		username,
		email,
		password,
		wishlist: [],
    checkout_history: [],
    order_history: []
	});
	user.save()
	.then(() => {
		console.log("Added a new user");
	})
	.catch((error) => {
		console.log(error);
	});
}

module.exports = {
	getUsers,
	getUserByID,
	getUserByEmail,
	addUser
}