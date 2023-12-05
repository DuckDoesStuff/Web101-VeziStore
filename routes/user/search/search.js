const express = require("express");
const router = express.Router();
const productController = require("../../../src/product/product.controller");

const css_files = [
    "assets/plugins/fancybox/source/jquery.fancybox.css",
    "assets/plugins/owl.carousel/assets/owl.carousel.css",
    "assets/plugins/uniform/css/uniform.default.css",
    "http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css",
    "assets/plugins/rateit/src/rateit.css",
    "assets/pages/css/components.css",
    "assets/corporate/css/style.css",
    "assets/pages/css/style-shop.css",
    "assets/corporate/css/style-responsive.css",
    "assets/corporate/css/themes/red.css",
    "assets/corporate/css/custom.css",
];

const js_files = [
    "assets/plugins/fancybox/source/jquery.fancybox.pack.js",
    "assets/plugins/owl.carousel/owl.carousel.min.js",
    "assets/plugins/zoom/jquery.zoom.min.js",
    "assets/plugins/bootstrap-touchspin/bootstrap.touchspin.js",
    "assets/plugins/uniform/jquery.uniform.min.js",
    "assets/plugins/rateit/src/jquery.rateit.js",
    "http://code.jquery.com/ui/1.10.3/jquery-ui.js",
    "assets/corporate/scripts/layout.js",
];

const categoriesData = [
    {
        name: "Woman",
        types: ["Tops", "Dresses", "Activewear", "Accessories", "Footwear"],
    },
    {
        name: "Man",
        types: ["T-Shirts", "Shirts", "Bottoms", "Outterwear", "Footwear"],
    },
    {
        name: "Kids",
        types: ["Sleepwear", "School", "Activity", "Summer"],
    },
];

async function performSearch(searchTerm, page) {
    try {
        // Sử dụng hàm tìm kiếm của Mongoose hoặc cơ sở dữ liệu của bạn
        const searchResult = await productController.getProductByName(
            searchTerm
        );
        const productData = searchResult.slice((page - 1) * 9, page * 9);
        const bestsellerData = await productController.getPopularProducts();

        // Trả về kết quả tìm kiếm
        return {
            title: "Vezi",
            searchName: searchTerm,
            categories: categoriesData,
            css_files: css_files,
            js_files: js_files,
            bestsellerData: { ...bestsellerData },
            productData: { ...productData },
            productCount: productData.length,
            pages: Array.from(
                { length: Math.ceil(searchResult.length / 9) },
                (_, i) => ({
                    page: i + 1,
                    url: `/search-product/?term=${searchTerm}&page=${i + 1}`,
                })
            ),
            curPage: page,
        };
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error("Error performing search:", error);
        throw error; // Nếu không muốn xử lý lỗi ở đây, bạn có thể loại bỏ dòng này.
    }
}

router.get("/", async function (req, res, next) {
    const searchTerm = req.query.term;
    const page = req.query.page || 1;

    // Gọi hàm xử lý tìm kiếm từ backend controller hoặc service
    const data = await performSearch(searchTerm, page);

    // Trả kết quả về phía frontend dưới dạng JSON
    console.log(searchTerm);
    res.render("user/search/productSearch", data);
});

module.exports = router;