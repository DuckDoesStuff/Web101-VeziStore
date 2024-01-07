const express = require("express");
const router = express.Router();
const Order = require("./order.model");
const Cart = require("../cart/cart.model");
const User = require("../user/user.model");
const userService = require("../user/user.service");
const orderService = require("../order/order.service");
const productService = require("../product/product.service");

const createOrder = async (req, res, next) => {
    const cart = await Cart.findById(req.body.cartId).populate("item.product");
    const address = req.body.address;
    const phone = req.body.phone;
    const payment = req.body.payment;
    const shipping = req.body.shipping;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const item = cart.item;

    let total = cart.total;
    if (shipping == "slow") {
        total += 3;
    } else if (shipping == "fast") {
        total += 6;
    }

    const user = await User.findById(req.user.id);
    if(!user.verified) {
        return res.json({
            error: "error",
            message: "Please verify your email before ordering",
        })
    }

    let newOrder;
    try {
        newOrder = new Order({
            user: req.user.id,
            first_name: firstName,
            last_name: lastName,
            phone: phone,
            email: email,
            address: address,
            shipping: shipping,
            payment: payment,
            total: total,
            item: item,
            status: "Pending",
        });

        let flag = false;
        item.forEach((item) => {
            if (flag) return;
            if (
                item.product.availability < item.quantity ||
                !item.product.availability
            ) {
                flag = true;
                return res.json({
                    error: "error",
                    message:
                        "Some of your item doesn't have enough stock, please check your cart again",
                });
            }
            item.product.availability -= item.quantity;
        });
        if (flag) return;
        await newOrder.save();
    }
    catch (err) {
        console.log(err);
        return res.json({
            error: "error",
        })
    }

    item.forEach((item) => {
        item.product.save();
    });
    user.order.push(newOrder._id);
    user.save();

    cart.item = [];
    cart.total = 0;
    cart.save();

    if (payment == "vnpay") {
        res.locals.amount = total;
        res.locals.bankCode = "";
        res.locals.locale = "vn";
        next();
    }
    else
        return res.json({
            success: "success",
            url: "/user/order",
        });

};
exports.createOrder = createOrder;

const dashboard = async (req, res, next) => {
    const user = await userService.getUserById(req.user.id);
    res.render("admin/order/order-dashboard", {
        title: "Vezi Store | Order Dashboard",
        showSideBar: true,
        user: req.user,
        picture: user.picture,
        mode: false,
    });
};

exports.dashboard = dashboard;

const viewOrder = async (req, res, next) => {
    return res.render("user/profile/orderHistory", {
        title: "Order history",
        user: req.user,
    });
};
exports.viewOrder = viewOrder;

const getOrderHistory = async (req, res, next) => {
    const page = req.query.page || 1;
    const orders = await Order.find({ user: req.user.id }).sort({
        createdAt: -1,
    });
    const ordersPerPage = 5;
    const numOfOrders = orders.length;
    const numOfPages = Math.ceil(numOfOrders / ordersPerPage);

    return res.json({
        orders: orders.slice((page - 1) * ordersPerPage, (page - 1) * ordersPerPage + ordersPerPage),
        totalPages: numOfPages,
        currentPage: page,
    });
};
exports.getOrderHistory = getOrderHistory;

const getOrder = async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("item.product");
    return res.json({
        order: order,
    });
};
exports.getOrder = getOrder;

const completeOrder = async (req, res, next) => {
	const order = await Order.findById(req.params.id);
	order.status = "Done";
	order.save();
	return res.json({
		success: "success",
		message: "Order completed",
	});
}
exports.completeOrder = completeOrder;

const getOrders = async (req, res, next) => {
    const page = req.query.page || 1;
    const filter = req.query.filter || 0;
    const orderID = req.query.orderID || "";

    res.json(await orderService.getOrders(page, filter, orderID));
};
exports.getOrders = getOrders;

const changeOrderStatus = async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    order.status = "Shipping";
    await order.save();
    res.status(200).json({ message: "Change status succesfully" });
};
exports.changeOrderStatus = changeOrderStatus;

const orderDetail = async (req, res, next) => {
    const user = await userService.getUserById(req.user.id);
    const orderDetail = await Order.findById(req.params.id).lean();
    let products = [];
    for (const product of orderDetail.item) {
        let query = {};
        const tempProduct = await productService.getProductById(
            product.product
        );
        console.log(tempProduct);

        query.id = tempProduct._id;
        query.name = tempProduct.name;
        query.price = tempProduct.price;
        query.amount = product.quantity;
        query.total = product.total;
        products.push(query);
    }
    console.log(products);
    res.render("admin/order/order-info", {
        title: "Vezi Store | ",
        orderDetail: orderDetail,
        products: products,
        showSideBar: true,
        user: req.user,
        picture: user.picture,
        mode: false,
    });
};
exports.orderDetail = orderDetail;

const reportOverall = async (req, res, next) => {
    const user = await userService.getUserById(req.user.id);
    res.render("admin/report/report-overal", {
        title: "Vezi Store | Order Dashboard",
        showSideBar: true,
        user: req.user,
        picture: user.picture,
        mode: false,
    });
};

exports.reportOverall = reportOverall;

const overallData = async (req, res, next) => {
    const startDate = req.query.start;
    const endDate = req.query.end;

	const ordersInDateRange = await Order.find({
        createdAt: { $gte: startDate, $lte: endDate },
        status: "Done",
    });
    const orderCount = ordersInDateRange.length;
	let totalCost = 0;
    for (const order of ordersInDateRange) {
      totalCost += order.total;
    }
    
    res.json({
        orderCount,
        totalCost: totalCost,
    });
};
exports.overallData = overallData;
