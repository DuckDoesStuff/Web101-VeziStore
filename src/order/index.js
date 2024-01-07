const express = require("express");
const router = express.Router();
const orderController = require("./order.controller");

router.post("/create", orderController.createOrder);
router.post("/:id", orderController.getOrder);


router.get("/", orderController.viewOrder);
router.post("/", orderController.getOrderHistory);

module.exports = router;