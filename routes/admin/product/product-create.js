const express = require("express");
const router = express.Router();
const multer = require("multer");
const sharp = require("sharp");
const dotenv = require("dotenv");
const {UploadClient} = require('@uploadcare/upload-client');
const productController = require("../../../src/product/product.controller");
const categoryController = require("../../../src/category/category.controller");

dotenv.config();
// Set up uploadcare client
const uploadcare = new UploadClient({
    publicKey: process.env.UPLOADCARE_PUBLIC_KEY
});

// Set up multer with memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", function (req, res, next) {
    res.render("admin/product/product-create");
});

router.post("/", upload.array("files"), async (req, res, next) => {
    const {
        name,
        price,
        discount,
        availability,
        category,
        subcategory,
        size,
        color,
        rating,
        description,
        information,
        review,
    } = req.body;
    const files = req.files;
    const images = await Promise.all(files.map(async (file) => {
        const uploadedFile = await uploadcare.uploadFile(file.buffer);
        return uploadedFile.uuid;
    }));
    productController
        .createProduct(
            name,
            images,
            price,
            discount,
            availability,
            category,
            subcategory,
            size,
            color,
            rating,
            description,
            information,
            review
        )
        .then((product) => {
            categoryController.addProductToCategoryAndSubcategory(
                category,
                subcategory,
                product._id
            );
            res.redirect("/");
        })
        .catch((err) => {
            console.log(err);
            res.redirect("/product-create");
        });
});

module.exports = router;
