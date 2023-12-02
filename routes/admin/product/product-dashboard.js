const express = require("express");
const router = express.Router();
const productController = require('../../../src/product/product.controller');

const productsPerPage = 2; // Số sản phẩm mỗi trang

function paginateProducts(products, currentPage) {
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  return products.slice(startIndex, endIndex);
}

async function generateProductDashboard() {
    const allProducts = await productController.getAllProduct();
    const totalPages = Math.ceil(allProducts.length / productsPerPage);
    const currentPage = 1; // Đối với trang đầu tiên
    const paginatedProducts = paginateProducts(allProducts, currentPage);
    return {
        allProducts: paginatedProducts,
        totalPages,
        currentPage,
      };
}

router.get("/", async function (req, res, next) {
    let currentPage = req.query.page || 1;
    currentPage = parseInt(currentPage, 2);

    const data = await generateProductDashboard(currentPage);
    res.render("admin/product/product-dashboard", data);
});

module.exports = router;
