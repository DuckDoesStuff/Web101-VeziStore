const express = require("express");
const router = express.Router();
const multer = require("multer");
const sharp = require("sharp");
const dotenv = require("dotenv");
const { UploadClient } = require("@uploadcare/upload-client");
const productController = require("../../../src/product/product.controller");
const categoryController = require("../../../src/category/category.controller");

dotenv.config();
// Set up uploadcare client
const uploadcare = new UploadClient({
    publicKey: process.env.UPLOADCARE_PUBLIC_KEY,
});

// Set up multer with memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", function (req, res, next) {
    res.render("admin/product/product-create");
});

// Thêm endpoint API để lấy danh sách subcategory dựa trên category
router.get("/",async (req, res) => {
    const category = req.params.category;
    // Thay thế logic này bằng cách lấy danh sách subcategory tương ứng với category từ cơ sở dữ liệu hoặc nguồn dữ liệu khác
    let subcategories = [];
    switch (category) {
        case 'Woman':
            subcategories = ['Tops', 'Dresses', 'Activewear', 'Accessories', 'Footwear'];
            break;
        case 'Man':
            subcategories = ['T-Shirts', 'Shirts', 'Bottoms', 'Outterwear'];
            break;
        case 'Kid':
        subcategories = ['Sleepwear', 'School', 'Activity', 'Summer'];
        break;
        // Thêm các trường hợp khác nếu cần
    }

    res.json({ subcategories });
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
    const lowerCaseCategory = String(category).toLowerCase();
    const lowerCaseSubCategory = String(subcategory).toLowerCase();

    const files = req.files;
    const images = await Promise.all(
        files.map(async (file) => {
            const uploadedFile = await uploadcare.uploadFile(file.buffer);
            return uploadedFile.uuid;
        })
    );
    productController
        .createProduct(
            name,
            images,
            price,
            discount,
            availability,
            lowerCaseCategory,
            lowerCaseSubCategory,
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
