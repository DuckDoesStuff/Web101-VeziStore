const express = require("express");
const router = express.Router();
const orderController = require("./order.controller");
const paymentController = require("../payment/payment.controller");

router.post("/create", orderController.createOrder, paymentController.paymentProcess);
router.post("/:id", orderController.getOrder);


router.get("/", orderController.viewOrder);
router.post("/", orderController.getOrderHistory);

module.exports = router;