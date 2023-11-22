const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
    res.render("user/sign-in/signIn");
});

module.exports = router;