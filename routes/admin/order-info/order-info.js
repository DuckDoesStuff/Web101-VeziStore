const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
    res.render("admin/order-info/order-info");
});

module.exports = router;
