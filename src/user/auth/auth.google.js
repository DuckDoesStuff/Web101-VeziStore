const express = require('express');
const router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv');
dotenv.config();

const siteURL = process.env.NODE_ENV === 'production' ? 'https://vezi.store' : 'http://localhost:3000';

passport.use(new GoogleStrategy({
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: siteURL + '/auth/google/callback',
	},
	(accessToken, refreshToken, profile, done) => {
		return done(null, profile);
	}
));

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

router.get('/', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/callback', 
  passport.authenticate('google', { failureRedirect: 'auth/signup' }),
  function(req, res) {
    res.redirect('/');
  });
module.exports = router;