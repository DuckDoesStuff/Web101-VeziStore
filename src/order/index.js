const express = require("express");
const router = express.Router();
const orderController = require("./order.controller");

router.post("/create", orderController.createOrder);
router.get("/:id", orderController.orderDetail);
router.get("/", orderController.viewOrder);
router.post("/", orderController.getOrder);

module.exports = router;