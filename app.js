const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const exphbs = require("express-handlebars");
const vhost = require("vhost");
const db = require("./src/db");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo");
const dotenv = require("dotenv");
const setLayout = require("./src/middleware");
const express_handlebars_sections = require('express-handlebars-sections');
dotenv.config();

db();

const app = express();
const admin = express();

app.use(vhost("admin.vezi.store", admin));
app.use(vhost("admin.*", admin));
app.use(setLayout);

const port = process.env.PORT || 3000;

// View engine configuration
const hbs = exphbs.create({
    extname: ".hbs",
    defaultLayout: "layout",
    layoutsDir: path.join(__dirname, "views/user"),
    partialsDir: path.join(__dirname, "views/user/partials"),
    helpers: {
        eq: function (v1, v2) {
            return v1 === v2 || v1.toLowerCase() === v2.toLowerCase();
        },
        lowercase: function (str) {
            return str.toLowerCase();
        },
        subtract: (price, discount) => {
            return price - discount;
        },
    },
});
express_handlebars_sections(hbs);

const adminHbs = exphbs.create({
    extname: ".hbs",
    defaultLayout: "admin-layout",
    layoutsDir: path.join(__dirname, "views/admin"),
    partialsDir: path.join(__dirname, "views/admin/partials"),
    helpers: {
        eq: function (v1, v2) {
            return v1 === v2;
        },
        lowercase: function (str) {
            return str.toLowerCase();
        },
    },
});
express_handlebars_sections(adminHbs);

// Setup view engine for both admin and normal routing
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");

admin.engine("hbs", adminHbs.engine);
admin.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

admin.use(express.json());
admin.use(express.urlencoded({ extended: true }));
// Express session setup
app.use(session({
	secret: process.env.SECRET_KEY,
	resave: false,
	saveUninitialized: true,
	store: MongoStore.create({ mongoUrl: process.env.ATLAS_URI }),
	cookie: { maxAge: 12 * 60 * 60 * 1000 } // 12h in ms
}));

// Passport initialize and session
app.use(passport.initialize());
app.use(passport.session());

// Normal router
const homeRouter = require("./src");
const productRouter = require("./src/product");
const authRouter = require("./src/user/auth");
const userRouter = require("./src/user");

// Admin router
// const usersDashboardRouter = require("./routes/admin/account/user-dashboard");
const adminProductRouter = require("./src/product/index-admin");
// const userInfoRouter = require("./routes/admin/account/user-info");
// const orderInfoRouter = require("./routes/admin/order-info/order-info");
// const productCreateRouter = require("./routes/admin/product/product-create");
// const productInfoRouter = require("./routes/admin/product/product-info");

// Normal routing
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/auth/signin");
};

app.use("/", homeRouter);
app.use("/home", homeRouter);
app.use("/auth", authRouter);
app.use("/product", productRouter);
app.use("/user", isAuthenticated, userRouter);

// Subdomain admin routing
//admin.use("/", adminProductRouter);
admin.use("/products", adminProductRouter);

//admin.use("/", productRouter);
// admin.use("/users-dashboard", usersDashboardRouter);
// admin.use("/products-dashboard", productsDashboardRouter);

// admin.use("/user-info", userInfoRouter);
// admin.use("/order-info", orderInfoRouter);
// admin.use("/product-create", productCreateRouter);
// admin.use("/product-info", productInfoRouter);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // render the error page

    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
