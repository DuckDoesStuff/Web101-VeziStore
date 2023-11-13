const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const exphbs = require('express-handlebars');

const app = express();

const port = process.env.PORT || 3000;
// view engine setup
const hbs = exphbs.create({
  extname: '.hbs',
  defaultLayout: 'layout',
  layoutsDir: path.join(__dirname, 'views'),
  partialsDir: path.join(__dirname, 'views/partials'),
  helpers: {
    eq: function (v1, v2) {
      return v1 === v2;
    },
    lowercase: function (str) {
      return str.toLowerCase();
    },
  }
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Need to add routing in here
const indexRouter = require('./routes/index');
const categoryRouter = require('./routes/category');
const productRouter = require('./routes/product-detail');
const cartRouter = require('./routes/shop-cart');
const wishlistRouter = require('./routes/user-wishlist');

app.use('/', indexRouter);
app.use('/home', indexRouter);
app.use('/product-detail/', productRouter);
app.use('/category/', categoryRouter);
app.use('/shop-cart', cartRouter);
app.use('/mywishlist', wishlistRouter);


// admin. subdomain routing

// admin.get('/', function(req, res, next) {
//   res.send("hiii");
// });



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
