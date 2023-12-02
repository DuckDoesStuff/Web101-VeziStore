function setLayout(req, res, next) {
    // Nếu đây là trang login, thiết lập một biến trong res.locals để xác định không hiển thị header và footer
    res.locals.showHeaderFooter = !req.path.includes('/sign-in') && !req.path.includes('/sign-up');
    next();
  }
  
module.exports = setLayout;