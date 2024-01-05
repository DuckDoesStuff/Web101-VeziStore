const express = require('express');
const router = express.Router();

const multer = require("multer");
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

router.post('/:id', productController.getProduct);

router.post('/update/:id', productController.updateProduct);

router.post('/delete-thumbnail/:id', productController.removeImage);

router.post('/add-thumbnail/:id', upload.array("image"), productController.addImage);


module.exports = router;
