const express = require('express');
const router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../user.model');
const Cart = require('../../cart/cart.model');

const { UploadClient } = require("@uploadcare/upload-client");
const uploadcare = new UploadClient({
	publicKey: process.env.UPLOADCARE_PUBLIC_KEY,
});

const siteURL = process.env.NODE_ENV === 'production' ? 'https://vezi.store' : 'http://localhost:3000';

passport.use(new GoogleStrategy({
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: siteURL + '/auth/google/callback',
	},
	async (accessToken, refreshToken, profile, done) => {
		const email = profile.emails[0].value;
		const googleId = profile.id;
		const firstName = profile.name.givenName;
		const lastName = profile.name.familyName;
		const picture = profile.photos[0].value;

		const user = await User.findOne({ googleId: googleId });
		if(user) {
			return done(null, user);
		}

		const localUser = await User.findOne({ email: email });
		if(localUser) {
			const result = await uploadcare.fromUrl(picture, {store: true});
			const file = await uploadcare.fromUrlStatus(result.token);
			localUser.googleId = googleId;
			localUser.picture = file.uuid;
			localUser.first_name = firstName;
			localUser.last_name = lastName;
			await localUser.save();
			return done(null, localUser);
		}
		
		const result = await uploadcare.fromUrl(picture, {store: true});
		const file = await uploadcare.fromUrlStatus(result.token);
		const newUser = new User({
			username: email,
			email: email,
			password: googleId,
			googleId: googleId,
			picture: file.uuid,
			first_name: firstName,
			last_name: lastName,
		});
		await newUser.save();

		const newCart = new Cart({
			item: [],
			total: 0
		});
		await newCart.save();
		newUser.cart = newCart._id;
		await newUser.save();

		return done(null, newUser);
	}
));

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

router.get('/', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/callback', 
  passport.authenticate('google', { failureRedirect: 'auth/signup' }),
  async (req, res) => {
		res.redirect(req.query.returnUrl || '/');
	}
);
module.exports = router;