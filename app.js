const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const exphbs = require("express-handlebars");
const vhost = require("vhost");

const app = express();
// const adminApp = express();

const port = process.env.PORT || 3000;

// view engine setup
const hbs = exphbs.create({
    extname: ".hbs",
    defaultLayout: "admin-layout",
    layoutsDir: path.join(__dirname, "views/admin"),
    helpers: {
        eq: function (v1, v2) {
            return v1 === v2;
        },
    },
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");

// View engine setup for adminApp
// const adminHbs = exphbs.create({
//     extname: ".hbs",
//     defaultLayout: "admin-layout", // Default layout for the admin subdomain
//     layoutsDir: path.join(__dirname, "views"),
//     helpers: {
//         eq: function (v1, v2) {
//             return v1 === v2;
//         },
//     },
// });
// adminApp.engine("hbs", adminHbs.engine);
// adminApp.set("view engine", "hbs");
// adminApp.use(express.static(path.join(__dirname, "public")));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Need to add routing in here
const indexRouter = require("./routes/index");
const categoryRouter = require("./routes/category");
const usersRouter = require("./routes/users");
const usersDashboardRouter = require("./routes/admin/users-dashboard");

app.use("/", indexRouter);
app.use("/home", indexRouter);
app.use("/category", categoryRouter);
app.use("/users", usersRouter);
app.use("/users", usersDashboardRouter);

// app.use(vhost("admin.localhost", adminApp));

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
