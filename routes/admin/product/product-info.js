const express = require("express");
const router = express.Router();

const product_info = {
    id:123,
    name: "COOL GREEN DRESS WITH RED BELL",
    price: 47,
    discount: 7,
    availability: 30,
    sold: 10,
    rating: 4.5
}

router.get("/", function (req, res, next) {
    res.render("admin/product/product-info", {product_info: product_info});
});

module.exports = router;
