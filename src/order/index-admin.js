const express = require("express");
const router = express.Router();
const orderController = require("./order.controller");

router.post('/dashboard/', orderController.getOrders);

router.get("/dashboard/", orderController.dashboard);

router.post("/dashboard/api/change-status/:id", orderController.changeOrderStatus);

router.post("/:id", orderController.getOrder);

router.get("/", orderController.viewOrder);

module.exports = router;