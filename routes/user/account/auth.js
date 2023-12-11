const express = require("express");
const router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../../../src/user/user.model");

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
                return done(null, false, { message: "Your password is incorrect, please try again" });
            }

            return done(null, user);
        } catch (error) {
            console.log(error);
            return done(null, false, { message: "Something else went wrong please try again." });
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, {id: user.id, username: user.username});
});

passport.deserializeUser(async (user, done) => {
    try {
        done(null, user);
    } catch (error) {
        done(error);
    }
});

router.get("/sign-in", (req, res) => {
    res.render("user/account/signIn", {title: "Sign In"});
});

router.get("/sign-up", (req, res) => {
    res.render("user/account/signUp", {title: "Sign Up"});
});

router.post("/sign-up", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if the username or password is empty
        if (username === "" || email === "" || password === "") {
            return res.render("user/account/signUp", {
                title: "Sign Up",
                error: "Please fill in all fields.",
            });
        }

        // Check if the username is already taken
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            // showError('Username is already taken.');
            return res.render("user/account/signUp", {
                title: "Sign Up",
                error: "Username is already taken.",
            });
        }

        // Check if the email is already taken
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            // showError('Username is already taken.');
            return res.render("user/account/signUp", {
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
                return res.render("user/account/signUp", {
                    title: "Sign Up",
                    error: "Login after registration failed. Please try logging in manually.",
                });
            }
            return res.redirect(req.session.returnTo || "/");
        });
    } catch (error) {
        console.error(error);
        res.render("user/account/signUp", {
            title: "Sign Up",
            error: "Registration failed. Please try again.",
        });
    }
});

router.post("/sign-in", (req, res) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return res.render("user/account/signIn", {
                title: "Sign In",
                error: err.message });
        }

        if (!user) {
            return res.render("user/account/signIn", { 
                error: info.message });
        }

        req.login(user, (err) => {
            if (err) {
                return res.render("user/account/signIn", {
                    title: "Sign In",
                    error: err.message,
                });
            }

            res.redirect(req.session.returnTo || "/");
        });
    })(req, res);
});

router.get("/logout", (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect(req.session.returnTo || "/");
    });
});


module.exports = router;
