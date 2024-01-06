const productService = require("./product.service");
const categoryService = require("../category/category.service");

const { UploadClient } = require("@uploadcare/upload-client");
const uploadcare = new UploadClient({
    publicKey: process.env.UPLOADCARE_PUBLIC_KEY,
});

const home = async (req, res, next) => {
    res.render("user/home", {
        title: "Vezi Store | Home",
        user: req.user,
        newProducts: await productService.getNewProducts(),
        saleProducts: await productService.getSaleProducts(),
        popularProducts: await productService.getPopularProducts(),
        categories: await categoryService.getAllCategory(),
        subcategories: await categoryService.getAllSubcategory(),
    });
};
exports.home = home;

const catalog = async (req, res, next) => {
    const currentCategory =
        req.query.cate.charAt(0).toUpperCase() + req.query.cate.slice(1);
    const currentType = req.query.type
        ? req.query.type.charAt(0).toUpperCase() + req.query.type.slice(1)
        : "";
    const popularProducts =
        await productService.getPopularProductsByCategoryAndSubcategory(
            req.query.cate,
            req.query.type
        );
    res.render("user/catalog", {
        title:
            "Vezi Store | " +
            currentCategory +
            " " +
            currentType +
            " | Catalog",
        user: req.user,
        categories: await categoryService.getAllCategory(),
        // subcategories: await categoryService.getAllSubcategory(),
        currentCategory: currentCategory,
        currentType: currentType,
        popularProducts: popularProducts,
    });
};
exports.catalog = catalog;

const dashboard = async (req, res, next) => {
    const currentCategory = req.query.cate
        ? req.query.cate.charAt(0).toUpperCase() + req.query.cate.slice(1)
        : "";
    const currentType = req.query.type
        ? req.query.type.charAt(0).toUpperCase() + req.query.type.slice(1)
        : "";
    res.render("admin/product/product-dashboard", {
        title:
            "Vezi Store | " +
            currentCategory +
            " " +
            currentType +
            " | Dashboard",
        categories: await categoryService.getAllCategory(),
        subcategories: await categoryService.getAllSubcategory(),
        currentCategory: currentCategory,
        currentType: currentType,
    });
};

exports.dashboard = dashboard;

const detail = async (req, res, next) => {
    const productDetail = await productService.getProductById(req.params.id);
    const similarProducts =
        await productService.getPopularProductsByCategoryAndSubcategory(
            productDetail.category,
            productDetail.subcategory
        );
    const popularProducts = await productService.getPopularProducts(6);
    res.render("user/productDetail", {
        title:
            "Vezi Store | " +
            productDetail.category +
            " " +
            productDetail.subcategory +
            " | Catalog",
        user: req.user,
        categories: await categoryService.getAllCategory(),
        // subcategories: await categoryService.getAllSubcategory(),
        currentCategory: productDetail.category[0],
        currentType: productDetail.subcategory[0],
        similarProducts: similarProducts,
        productDetail: productDetail,
        popularProducts: popularProducts,
    });
};
exports.detail = detail;

const search = async (req, res, next) => {
    const term = req.query.term;

    res.render("user/catalog", {
        title: "Vezi Store | Search",
        user: req.user,
        categories: await categoryService.getAllCategory(),
        // subcategories: await categoryService.getAllSubcategory(),
        currentCategory: "",
        currentType: "",
        searchName: term,
    });
};
exports.search = search;

const getProducts = async (req, res, next) => {
    const page = req.query.page || 1;
    const sort = req.query.sort || 0;
    const filter = req.query.filter || "";
    const category = req.query.cate || "";
    const subcategory = req.query.type || "";
    const term = req.query.term || "";
    res.json(
        await productService.getProducts(
            page,
            sort,
            filter,
            category,
            subcategory,
            term
        )
    );
};
exports.getProducts = getProducts;

const getSubByCate = async (req, res, next) => {
    const category = req.params.category;
    // Thay thế logic này bằng cách lấy danh sách subcategory tương ứng với category từ cơ sở dữ liệu hoặc nguồn dữ liệu khác
    let subcategories = [];
    switch (category) {
        case "woman":
            subcategories = [
                "tops",
                "dresses",
                "activewear",
                "accessories",
                "footwear",
            ];
            break;
        case "man":
            subcategories = ["t-shirts", "shirts", "bottoms", "outterwear"];
            break;
        case "kids":
            subcategories = ["sleepwear", "school", "activity", "summer"];
            break;
        // Thêm các trường hợp khác nếu cần
    }

    res.json({ subcategories });
};
exports.getSubByCate = getSubByCate;

const productDetailAdmin = async (req, res, next) => {
    const productDetail = await productService.getProductById(req.params.id);
    res.render("admin/product/product-info", {
        title:
            "Vezi Store | " +
            productDetail.category +
            " " +
            productDetail.subcategory +
            " | Catalog",
        currentCategory: productDetail.category[0],
        currentType: productDetail.subcategory[0],
        productDetail: productDetail,
    });
};
exports.productDetailAdmin = productDetailAdmin;

const productCreateDirect = async (req, res, next) => {
    res.render("admin/product/product-create");
};
exports.productCreateDirect = productCreateDirect;

const createProduct = async (req, res, next) => {
    const {
        name,
        price,
        discount,
        availability,
        category,
        subcategory,
        size,
        description,
        information,
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
    const product = await productService.createProduct(
        name,
        images,
        price,
        discount,
        availability,
        lowerCaseCategory,
        lowerCaseSubCategory,
        size,
        description,
        information
    );

    if (product) {
        categoryService.addProductToCategoryAndSubcategory(
            category,
            subcategory,
            product._id
        );
        res.redirect("/");
    } else {
        res.redirect("/products/create");
    }
};
exports.createProduct = createProduct;

const updateProduct = async (req, res, next) => {
    const productID = req.params.id;
    const name = req.body.product_name;
    const price = req.body.product_price;
    const discount = req.body.product_discount;
    const size = req.body.product_size;
    const availability = req.body.product_availability;
    const sold = req.body.product_sold;
    const cate = req.body.product_cate;
    const type = req.body.product_type;
    const description = req.body.product_description;
    const information = req.body.product_information;

    await productService.updateProduct(
        productID,
        name,
        price,
        discount,
        size,
        availability,
        cate,
        type,
        description,
        information
    );
    res.json({ message: "Update product successfully" });
};
exports.updateProduct = updateProduct;

const getProduct = async (req, res, next) => {
    const productID = req.params.id;
    const product = await productService.findProductByID(productID);
    return res.json(product);
};
exports.getProduct = getProduct;

const removeImage = async (req, res, next) => {
    const productID = req.params.id;
    const deleteImage = req.body.product_thumbnail_delete;
    await productService.deleteProductImage(productID, deleteImage);
    return res.sendStatus(200);
};
exports.removeImage = removeImage;

const addImage = async (req, res, next) => {
    const productID = req.params.id;
    const addThumbnail = req.files;

    const images = await Promise.all(
        addThumbnail.map(async (file) => {
            const uploadedFile = await uploadcare.uploadFile(file.buffer);
            return uploadedFile.uuid;
        })
    );
    await productService.addImage(productID, images);
    return res.sendStatus(200);
};
exports.addImage = addImage;

const deleteProduct = async (req, res, next) => {
    const productID = req.params.id;
    try {
        const deletedProduct = await productService.findAndDeleteProduct(productID);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully', deletedProduct });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.deleteProduct = deleteProduct;

