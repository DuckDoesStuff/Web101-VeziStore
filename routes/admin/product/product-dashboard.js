const express = require("express");
const router = express.Router();

const product_info = [
    {
        id:123,
        name: "COOL GREEN DRESS WITH RED BELL",
        price: 47,
        discount: 7,
        availability: 30,
    },
    {
        id:123,
        name: "COOL GREEN DRESS WITH RED BELL",
        price: 47,
        discount: 7,
        availability: 30,
    },
    {
        id:123,
        name: "COOL GREEN DRESS WITH RED BELL",
        price: 47,
        discount: 7,
        availability: 30,
    },
    {
        id:123,
        name: "COOL GREEN DRESS WITH RED BELL",
        price: 47,
        discount: 7,
        availability: 30,
    },
    {
        id:123,
        name: "COOL GREEN DRESS WITH RED BELL",
        price: 47,
        discount: 7,
        availability: 30,
    }
]


router.get("/", function (req, res, next) {
    res.render("admin/product/product-dashboard", {product_info: product_info});
});

module.exports = router;
