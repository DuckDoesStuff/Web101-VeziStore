const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../user.model");
const Cart = require("../../cart/cart.model");
const authService = require("./auth.service");
const Token = require("./auth.token");

passport.use(
	new LocalStrategy(async (username, password, done) => {
		try {
			const user = await User.findOne({ username });
			if (!user) {
				return done(null, false, { message: "Username doesn't exist" });
			}

			const isValidPassword = await user.isValidPassword(password);
			if (!isValidPassword) {
				return done(null, false, {
					message: "Your password is incorrect, please try again",
				});
			}

			return done(null, user);
		} catch (error) {
			console.log(error);
			return done(null, false, {
				message: "Something else went wrong please try again.",
			});
		}
	})
);

passport.serializeUser((user, done) => {
	done(null, { id: user.id, username: user.username, email: user.email });
});

passport.deserializeUser(async (user, done) => {
	try {
		done(null, user);
	} catch (error) {
		done(error);
	}
});

const signin = (req, res, next) => {
	res.render("user/auth/signIn", { title: "Sign In" });
};
exports.signin = signin;

const signup = (req, res, next) => {
	res.render("user/auth/signUp", { title: "Sign Up" });
};
exports.signup = signup;

const login = (req, res, next) => {
	passport.authenticate("local", (err, user, info) => {
		if (err) {
			return res.json({
				msg: err.message,
			});
		}
		
		if (!user) {
			return res.json({
				msg: info.message,
			});
		}

		req.login(user, (err) => {
			return res.json({
				success: "success",
				redirect: req.query.returnUrl || "/",
			})
		});
	})(req, res);
};
exports.login = login;

const logout = (req, res, next) => {
	req.logout(function (err) {
		req.session.destroy();
		if (err) {
			return next(err);
		}
		res.redirect(req.query.returnUrl || "/");
	});
};
exports.logout = logout;

const register = async (req, res, next) => {
	const { username, email, password } = req.body;

	// Check if the username or password is empty
	if (username === "" || email === "" || password === "") {
		return res.json({
			msg: "Please fill in all fields.",
		});
	}

	// Check if the username is already taken
	const existingUser = await User.findOne({ username });
	if (existingUser) {
		return res.json({
			msg: "Username is already taken.",
		});
	}

	// Check if the email is already taken
	const existingEmail = await User.findOne({ email });
	if (existingEmail) {
		return res.json({
			msg: "Email is already taken.",
		});
	}

	// Create a new user
	const newUser = new User({ username, email, password });
	await newUser.save();
	
	// Create a new cart for the user
	const newCart = new Cart({
		item: [],
		total: 0
	});
	await newCart.save();
	
	// Save the cart and associate it with the user
	newUser.cart = newCart._id;
	await newUser.save();

	// Generate an activation token
	const token = authService.generateToken();
	const newToken = new Token({ token: token, email: email });
	await newToken.save();
	authService.sendActivationEmail(email, token);

	// Log in the newly registered user
	req.login(newUser, (err) => {
		return res.json({
			success: "success",
			redirect: req.query.returnUrl || "/",
		});
	});
};
exports.register = register;

const activate = async (req, res, next) => {
	const token = req.params.token;
	if(!token) {
		return res.json({
			msg: "Invalid token.",
		});
	}

	const result = await Token.findOne({ token: token });
	const user = await User.findOne({ email: result.email });
	user.verified = true;
	await user.save();
	
	await Token.deleteOne({ token: token });
	res.redirect("/");
}
exports.activate = activate;

const forgotPassword = async (req, res, next) => {
	res.render("user/auth/forgotPassword", { title: "Forgot Password", showHeaderFooter: false});
}
exports.forgotPassword = forgotPassword;

const resetPassword = async (req, res, next) => {
	const { email } = req.body;

	// Check if the email is empty
	if (email === "") {
		return res.json({
			msg: "Please fill in all fields.",
		});
	}

	const existingEmail = await User.findOne({ email: email });
	if (!existingEmail) {
		return res.json({
			msg: "Email does not exist.",
		});
	}

	if(existingEmail.googleId) {
		return res.json({
			msg: "Please login with Google.",
		});
	}

	if(existingEmail.facebookId) {
		return res.json({
			msg: "Please login with Facebook.",
		});
	}

	// Generate a reset password token
	const token = await authService.generateToken();
	const newToken = new Token({ token: token, email: email });
	await newToken.save();
	authService.sendResetPasswordEmail(email, token);

	res.json({
		success: "success",
		msg: "Please check your email for the reset password link."
	});
}
exports.resetPassword = resetPassword;

const reset = async (req, res, next) => {
	const token = req.params.token;
	if(!token) {
		return res.json({
			msg: "Invalid token.",
		});
	}

	res.render("user/auth/resetPassword", { title: "Reset Password", showHeaderFooter: false, token: token});
}
exports.reset = reset;

const updatePassword = async (req, res, next) => {
	const token = req.params.token;
	if(!token) {
		return res.json({
			msg: "Invalid token.",
		});
	}

	const { password } = req.body;

	// Check if the password is empty
	if (password === "") {
		return res.json({
			msg: "Please fill in all fields.",
		});
	}

	const result = await Token.findOne({ token: token });
	if(!result.email) {
		return res.json({
			msg: "Invalid token.",
		});
	}

	const user = await User.findOne({ email: result.email });

	user.password = password;
	await user.save();
	
	await Token.deleteOne({ token: token });
	res.json({
		success: "success",
		msg: "Password has been updated. Please return to login page"
	});
}
exports.updatePassword = updatePassword;