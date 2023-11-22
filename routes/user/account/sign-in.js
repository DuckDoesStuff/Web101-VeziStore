const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
    res.render("user/account/signIn");
});

module.exports = router;