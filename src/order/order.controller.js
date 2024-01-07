const express = require("express");
const router = express.Router();
const Order = require("./order.model");
const Cart = require("../cart/cart.model");
const User = require("../user/user.model");
const userService = require("../user/user.service");
const orderService = require("../order/order.service")

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
	if(shipping == "slow"){
		total += 3;
	}else if(shipping == "fast") {
		total += 6;
	}

	const newOrder = new Order({
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
		if(flag) return;
		if(item.product.availability < item.quantity || !item.product.availability){
			flag = true;
			return res.json({
				error: "error",
				message: "Some of your item doesn't have enough stock, please check your cart again",
			});
		}
		item.product.availability -= item.quantity;
	})
	if(flag) return;

	item.forEach((item) => {
		item.product.save();
	});
	await newOrder.save();
	User.findByIdAndUpdate(req.user.id, 
		{$push: {order: newOrder._id}},
		{new: true, useFindAndModify: false}
	).then((user) => {
		user.save();
	});
		
	cart.item = [];
	cart.total = 0;
	cart.save();
	return res.json({
		success: "success",
		message: "Order created",
	});
};
exports.createOrder = createOrder;

const dashboard = async (req, res, next) => {
    const user = await userService.getUserById(req.user.id);
    res.render("admin/order/order-dashboard", {
        title:
            "Vezi Store | Order Dashboard",
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
}
exports.viewOrder = viewOrder;

const getOrderHistory = async (req, res, next) => {
	const orders = await Order.find({user: req.user.id}).sort({createdAt: -1});
	return res.json({
		orders: orders,
	});
}
exports.getOrderHistory = getOrderHistory;

const getOrder = async (req, res, next) => {
	const order = await Order.findById(req.params.id).populate("item.product");
	return res.json({
		order: order,
	});
}
exports.getOrder = getOrder;

const getOrders = async (req, res, next) => {
	const page = req.query.page || 1;
    const filter = req.query.filter || 0;
    const orderID = req.query.orderID || "";

    res.json(
        await orderService.getOrders(
            page,
            filter,
			orderID,
        )
    );
}
exports.getOrders = getOrders;

const changeOrderStatus = async (req, res, next) => {
	const order = await Order.findById(req.params.id);
	order.status = "Shipping";
	await order.save();
	res.status(200).json({ message: 'Change status succesfully'});
}
exports.changeOrderStatus = changeOrderStatus;
