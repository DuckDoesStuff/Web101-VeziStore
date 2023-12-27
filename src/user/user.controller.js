const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./user.model");
const {Product} = require("../product/product.model");

const categoryService = require("../category/category.service");
const productService = require("../product/product.service");
const userService = require("./user.service");

passport.use(
	new LocalStrategy(async (username, password, done) => {
		try {
			const user = await User.findOne({ username });
			if (!user) {
				return done(null, false, { message: "Username doesn't exist" });
			}
			// if (!email) {
			//     return done(null, false, { message: "Incorrect email." });
			// }

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
	done(null, { id: user.id, username: user.username });
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
			return res.render("user/auth/signIn", {
				title: "Sign In",
				error: err.message,
			});
		}
		
		if (!user) {
			return res.render("user/auth/signIn", {
				error: info.message,
			});
		}
		req.login(user, (err) => {
			if (err) {
				return res.render("user/auth/signIn", {
					title: "Sign In",
					error: err.message,
				});
			}
			res.redirect(req.query.returnUrl || "/");
		});
	})(req, res);
};
exports.login = login;

const logout = (req, res, next) => {
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
		res.redirect(req.query.returnUrl || "/");
	});
};
exports.logout = logout;

const register = async (req, res, next) => {
	try {
		const { username, email, password } = req.body;

		// Check if the username or password is empty
		if (username === "" || email === "" || password === "") {
			return res.render("user/auth/signUp", {
				title: "Sign Up",
				error: "Please fill in all fields.",
			});
		}

		// Check if the username is already taken
		const existingUser = await User.findOne({ username });
		if (existingUser) {
			// showError('Username is already taken.');
			return res.render("user/auth/signUp", {
				title: "Sign Up",
				error: "Username is already taken.",
			});
		}

		// Check if the email is already taken
		const existingEmail = await User.findOne({ email });
		if (existingEmail) {
			// showError('Username is already taken.');
			return res.render("user/auth/signUp", {
				title: "Sign Up",
				error: "Email is already taken.",
			});
		}

		// Create a new user
		const newUser = new User({ username, email, password });
		await newUser.save();

		// Log in the newly registered user
		req.login(newUser, (err) => {
			if (err) {
				console.error(err);
				return res.render("user/auth/signUp", {
					title: "Sign Up",
					error:
						"Login after registration failed. Please try logging in manually.",
				});
			}
			return res.redirect(req.query.returnUrl || "/");
		});
	} catch (error) {
		console.error(error);
		res.render("user/auth/signUp", {
			title: "Sign Up",
			error: "Registration failed. Please try again.",
		});
	}
};
exports.register = register;

const addToCart = async(req,res,next) => {
	const productId = req.params.id;
	const quantity = req.body.quantity;
	// Check for available stock
	let product = await productService.getProductById(productId);
	if (product.availability < quantity) {
		return res.json({status: "error", message: "Not enough stock"});
	}

	// Check if the user is logged in
	if (!req.user) {
		return res.json({status: "error", message: "Please login first"});
	}

	// Add to cart
	const result = await userService.addToCart(productId, quantity, req.user.id);
	return res.json(result);
}
exports.addToCart = addToCart;

const getCart = async (req, res, next) => {
	if(!req.user) {
		return res.json({status: "error", message: "Please login first"});
	}
	return res.json(await userService.getCart(req.user.id));
}
exports.getCart = getCart;

const viewCart = async (req, res, next) => {
	if(!req.user) {
		return res.redirect("/signin/?returnUrl=cart");
	}

	res.render("user/cart/shopCart", {
		title: "Shopping cart",
		user: req.user, 
		categories: await categoryService.getAllCategory(),
		subcategories: await categoryService.getAllSubcategory()
	});
}
exports.viewCart = viewCart;

const removeFromCart = async (req, res, next) => {
	const productId = req.params.id;
	const result = await userService.removeFromCart(productId, req.user.id);
	return res.json(result);
}
exports.removeFromCart = removeFromCart;

const updateCart = async (req, res, next) => {
	const productId = req.params.id;
	const quantity = req.body.quantity;
	const result = await userService.updateCart(productId, quantity, req.user.id);
	return res.json(result);
}
exports.updateCart = updateCart;