const User = require("../user/user.model");
const authService = require("../user/auth/auth.service");
const Token = require("../user/auth/auth.token");

const { UploadClient } = require("@uploadcare/upload-client");
const uploadcare = new UploadClient({
    publicKey: process.env.UPLOADCARE_PUBLIC_KEY,
});

const viewProfile = async (req, res, next) => {
	const user = await User.findById(req.user.id);
	res.render("user/profile/profile", {
		title: "Profile",
		user: req.user,
		picture: user.picture,
		first_name: user.first_name,
		last_name: user.last_name,
		email: user.email,
		address: user.address,
		phone: user.phone,
	});
}
exports.viewProfile = viewProfile;

const updateProfile = async (req, res, next) => {
	const user = await User.findById(req.user.id);
	const isNewEmail = user.email !== req.body.email;
	if(isNewEmail) {
		const existingUser = await User.findById({email: req.body.email});
		if(existingUser) {
			return res.json({message: "Email is already taken"})
		}

		user.verified = false;
		const token = authService.generateToken();
		const newToken = new Token({ token: token, email: req.body.email });
		await newToken.save();
		authService.sendActivationEmail(req.body.email, token);
	}

	user.first_name = req.body.first_name;
	user.last_name = req.body.last_name;
	user.email = req.body.email;
	user.address = req.body.address;
	user.phone = req.body.phone;

	await user.save();
	res.json({ message: "Update profile successfully" })
}
exports.updateProfile = updateProfile;

const uploadAvatar = async (req, res, next) => {
	const user = await User.findById(req.user.id);
	const file = req.file;
	const response = await uploadcare.uploadFile(file.buffer);
	user.picture = response.uuid;
	await user.save();
	res.sendStatus(200);
}
exports.uploadAvatar = uploadAvatar;

const changePassword = async (req, res,next) => {
	const user = await User.findById(req.user.id);
	res.render("user/profile/change-password", {
		title: "Change Password",
		user: req.user,
		picture: user.picture,
	});
}
exports.changePassword = changePassword;

const updatePassword = async (req, res, next) => {
	const user = await User.findById(req.user.id);

	if(user.googleId || user.facebookId) {
		return res.json({
			msg: "OAuth 2.0 account cannot update password.",
		});
	}

	const isValidPassword = await user.isValidPassword(req.body.current);
	if(!isValidPassword) {
		return res.json({message: "Current password is incorrect"});
	}

	user.password = req.body.new;
	await user.save();
	res.json({
		success: true
	});
}
exports.updatePassword = updatePassword;