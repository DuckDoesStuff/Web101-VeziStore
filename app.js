const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const exphbs = require("express-handlebars");
const vhost = require("vhost");

const app = express();
const admin = express();

app.use(vhost("admin.vezi.store", admin));

const port = process.env.PORT || 3000;

// View engine configuration
const hbs = exphbs.create({
    extname: ".hbs",
    defaultLayout: "layout",
    layoutsDir: path.join(__dirname, "views/user"),
    partialsDir: path.join(__dirname, "views/user/partials"),
    helpers: {
        eq: function (v1, v2) {
            return v1 === v2;
        },
        lowercase: function (str) {
            return str.toLowerCase();
        },
    },
});

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

// Setup view engine for both admin and normal routing
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");

admin.engine("hbs", adminHbs.engine);
admin.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Normal router
const indexRouter = require("./routes/user/home/index");
const categoryRouter = require("./routes/user/category/category");
const productRouter = require("./routes/user/product-detail/product-detail");
const cartRouter = require("./routes/user/shop-cart/shop-cart");
const wishlistRouter = require("./routes/user/wish-list/user-wishlist");

// Admin router
const usersDashboardRouter = require("./routes/admin/users-dashboard/users-dashboard");
const productsDashboardRouter = require("./routes/admin/products-dashboard/products-dashboard");
const userInfoRouter = require("./routes/admin/user-info/user-info");
const orderInfoRouter = require("./routes/admin/order-info/order-info");
const productCreateRouter = require("./routes/admin/product-create/product-create");
const productInfoRouter = require("./routes/admin/product-info/product-info");


// Normal routing

app.use("/", indexRouter);
app.use("/home", indexRouter);
app.use("/product-detail/", productRouter);
app.use("/category/", categoryRouter);
app.use("/shop-cart", cartRouter);
app.use("/mywishlist", wishlistRouter);

// Subdomain admin routing
admin.use("/", usersDashboardRouter);
admin.use("/users-dashboard", usersDashboardRouter);
admin.use("/products-dashboard", productsDashboardRouter);

admin.use("/user-info", userInfoRouter);
admin.use("/order-info", orderInfoRouter);
admin.use("/product-create", productCreateRouter);
admin.use("/product-info", productInfoRouter);





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
