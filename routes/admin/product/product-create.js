const express = require("express");
const router = express.Router();
const productController = require("../../../src/product/product.controller");
const categoryController = require("../../../src/category/category.controller");



router.get("/", function (req, res, next) {
    res.render("admin/product/product-create");
});

router.post("/", async (req, res, next) => {
    console.log(req.body);
});

module.exports = router;
