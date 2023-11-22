const User = require('./users.model');

const getUserByID = async(req, res) => {
	const { id } = req.params;
	const user = await User.findById(id);
	res.send(user)
}

const getUserByEmail = async (req, res) => {
	const { email } = req.params;
	const user = await User.findOne({ email });
	res.send(user);
}

const addUser = async(req, res) => {
	const { username, email, password } = req.body;
	const user = new User({
		username,
		email,
		password
	});
	await user.save();
	res.send(user);
}

