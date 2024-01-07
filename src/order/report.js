const express = require("express");
const router = express.Router();
const orderController = require("./order.controller");

router.get('/overall/', orderController.reportOverall);

router.get('/overall/api/', orderController.overallData);

module.exports = router;