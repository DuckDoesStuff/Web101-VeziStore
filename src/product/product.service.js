const Product = require("./product.model");

const getAllProduct = async () => {
    const products = await Product.find().lean();
    return products;
};

const getProductById = async (id) => {
    const product = await Product.findById(id).lean();
    return product;
};
exports.getProductById = getProductById;

const findProductByID = async (id) => {
    try {
        const product = await Product.findById(id);
        return product;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
exports.findProductByID = findProductByID;

const getProductsByName = async (name) => {
    const products = await Product.find({
        name: { $regex: new RegExp(name, "i") },
    }).lean();
    return products;
};
exports.getProductsByName = getProductsByName;

const getPopularProductsByCategoryAndSubcategory = (
    category,
    subcategory,
    num = 3
) => {
    if (subcategory) {
        return Product.find({
            category: { $in: [category] },
            subcategory: { $in: [subcategory] },
        })
            .sort({ rating: -1 })
            .limit(num)
            .lean();
    } else {
        return Product.find({
            category: { $in: [category] },
        })
            .sort({ rating: -1 })
            .limit(num)
            .lean();
    }
};
exports.getPopularProductsByCategoryAndSubcategory =
    getPopularProductsByCategoryAndSubcategory;

const getNewProducts = (num = 6) =>
    Product.find().sort({ createAt: -1 }).limit(num).lean();
exports.getNewProducts = getNewProducts;

const getSaleProducts = async (num = 6) =>
    Product.find({ discount: { $gt: 0 } })
        .sort({ discount: -1 })
        .limit(num)
        .lean();
exports.getSaleProducts = getSaleProducts;

const getPopularProducts = async (num = 4) =>
    Product.find().sort({ rating: -1 }).limit(num).lean();
exports.getPopularProducts = getPopularProducts;

const getProducts = async (page, sort, filter, category, subcategory, term) => {
    let query = {};
    if (category) {
        query.category = category;
    }
    if (subcategory) {
        query.subcategory = subcategory;
    }
    if (term) {
        query.name = { $regex: new RegExp(term, "i") };
    }
    let products = await Product.find(query).lean();

    products = sortProducts(products, sort);
    products = filterProducts(products, filter);
    const productCount = products.length;
    products = products.slice((page - 1) * 9, (page - 1) * 9 + 9);
    products.forEach((product) => {
        product.price = product.price - product.discount;
    });
    return {
        products: products,
        productCount: productCount,
    };
};
exports.getProducts = getProducts;

const createProduct = async (
    name,
    image,
    price,
    discount,
    availability,
    category,
    subcategory,
    size,
    description,
    information
) => {
    const newProduct = new Product({
        name: name,
        image: image,
        price: price,
        discount: discount,
        availability: availability,
        category: category,
        subcategory: subcategory,
        size: size,
        description: description,
        information: information,
    });
    await newProduct.save();
    return newProduct;
};

exports.createProduct = createProduct;

const addReviewToProduct = async (id, review) => {
    const product = await Product.findById(id);
    product.review.push(review._id);
    product.rating =
        (product.rating * (product.review.length - 1) + review.rating) /
        product.review.length;
    await product.save();
};
exports.addReviewToProduct = addReviewToProduct;

const sortProductsByTime = (productData) => {
    const sortedProducts = [...productData];

    sortedProducts.sort((a, b) => {
        const timeA = new Date(a.createAt).getTime();
        const timeB = new Date(b.createAt).getTime();
        return timeB - timeA;
    });

    return sortedProducts;
};
exports.sortProductsByTime = sortProductsByTime;

const sortProductsByPriceDes = (productData) => {
    const sortedProducts = [...productData];
    sortedProducts.sort((a, b) => {
        const priceA = a.price - a.discount;
        const priceB = b.price - b.discount;
        return priceB - priceA;
    });

    return sortedProducts;
};
exports.sortProductsByPriceDes = sortProductsByPriceDes;

const sortProductsByPriceAsc = (productData) => {
    const sortedProducts = [...productData];

    sortedProducts.sort((a, b) => {
        const priceA = a.price - a.discount;
        const priceB = b.price - b.discount;
        return priceA - priceB;
    });

    return sortedProducts;
};
exports.sortProductsByPriceAsc = sortProductsByPriceAsc;

const sortProducts = (productData, sort) => {
    let products = [...productData];
    switch (sort) {
        case "1":
            products = sortProductsByTime(products);
            break;
        case "2":
            products = sortProductsByPriceAsc(products);
            break;
        case "3":
            products = sortProductsByPriceDes(products);
            break;
        default:
            break;
    }
    return products;
};
exports.sortProducts = sortProducts;

const filterProducts = (productData, filter) => {
    let products = [...productData];
    if (filter == "1") {
        return products.filter((product) => {
            const productPrice = product.price;
            return productPrice >= 0 && productPrice <= 100;
        });
    }
    if (filter == "2") {
        return products.filter((product) => {
            const productPrice = product.price;
            return productPrice >= 100 && productPrice <= 200;
        });
    }
    if (filter == "3") {
        return products.filter((product) => {
            const productPrice = product.price;
            return productPrice >= 200;
        });
    }
    return products;
};
exports.filterProducts = filterProducts;

const updateProduct = async (
    id,
    name,
    price,
    discount,
    size,
    availability,
    cate,
    type,
    description,
    information
) => {
    const product = await Product.findById(id);

    product.name = name;
    product.price = price;
    product.discount = discount;
    product.size = size;
    product.availability = availability;
    product.category = cate;
    product.subcategory = type;
    product.description = description;
    product.information = information;

    await product.save();
};
exports.updateProduct = updateProduct;
