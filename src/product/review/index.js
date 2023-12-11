const express = require('express');
const router = express.Router({ mergeParams: true });

const reviewController = require('./review.controller');

router.get('/', reviewController.getReview)
router.post('/', reviewController.createReview);

module.exports = router;