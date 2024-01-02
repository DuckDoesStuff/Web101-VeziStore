const express = require("express");
const router = express.Router();

const cartRouter = require("../cart/");
const profileRouter = require("../profile/");
const orderRouter = require("../order/");

router.use("/cart", cartRouter);
router.use("/profile", profileRouter);
router.use("/order", orderRouter)


module.exports = router;