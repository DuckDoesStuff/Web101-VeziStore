const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
    res.render("admin/product-create");
});

module.exports = router;
