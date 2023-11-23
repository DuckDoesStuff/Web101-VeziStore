const express = require("express");
const router = express.Router();
const multer = require("multer");
const productController = require("../../../src/product/product.controller");
const categoryController = require("../../../src/category/category.controller");


// Set up multer with memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", function (req, res, next) {
    res.render("admin/product/product-create");
});

router.post("/", upload.array('files'), async (req, res, next) => {
    const { name, 
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
            review } = req.body;

    const files = req.files;
    // Need to reduce file size later

    const base64Files = files.map((file, index) => {
        return {
            base64: file.buffer.toString('base64'),
        };
    });
    productController.createProduct(name, base64Files, price, discount, availability, category, subcategory, size, color, rating, description, information, review)
    .then((product) => {
        categoryController.addProductToCategory(category, product._id);
        categoryController.addProductToSubcategory(subcategory, product._id);
        res.redirect("/");
    })
    .catch((err) => {
        console.log(err);
        res.redirect("/product-create");
    });
});

module.exports = router;
