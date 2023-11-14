const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
    res.render("admin/user-info");
});

module.exports = router;
