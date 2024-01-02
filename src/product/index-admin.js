const express = require('express');
const router = express.Router();

const { UploadClient } = require("@uploadcare/upload-client");
const multer = require("multer");
const dotenv = require("dotenv");
dotenv.config();

// Set up uploadcare client
const uploadcare = new UploadClient({
    publicKey: process.env.UPLOADCARE_PUBLIC_KEY,
});
// Set up multer with memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const productController = require('./product.controller');

router.post('/dashboard/', productController.getProducts);

router.get('/dashboard/', productController.dashboard);

router.get('/dashboard/api/subcategories/:category', productController.getSubByCate);

router.get('/create/api/subcategories/:category', productController.getSubByCate);


router.get('/create/', productController.productCreateDirect);

router.post('/create/', upload.array("files"), productController.createProduct);

router.get('/:id', productController.productDetailAdmin);

module.exports = router;
