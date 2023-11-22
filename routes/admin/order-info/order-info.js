const express = require("express");
const router = express.Router();

const order_info = {
    product: [
        {
            id:123,
            name: ">BERRY LACE DRESS 2",
            price:29,
            amount:1,
            total:29
        },
        {
            id:123,
            name: ">BERRY LACE DRESS 2",
            price:29,
            amount:2,
            total:58
        }
    ],
    total_product: 87,
    discount: 37,
    total_order: 50,
    id: "G472630",
    date: "11/10/2023",
    username: "nhung1899",
    phone: "01234567890",
    address: "79 Au Co P.14 Q.11 TP.HCM"
}

router.get("/", function (req, res, next) {
    res.render("admin/order-info/order-info", {order_info: order_info});
});

module.exports = router;
