const Order = require("./order.model");
const { ObjectId } = require('mongoose').Types;

const filterOrders = async (orderData, filter) => {
    let orders = [...orderData];
    let query = {};
    switch (filter) {
        case "1":
            query.status = "Pending";
            orders = await Order.find(query).lean();
            break;
        case "2":
            query.status = "Shipping";
            orders = await Order.find(query).lean();
            break;
        case "3":
            query.status = "Done";
            orders = await Order.find(query).lean();
            break;
        default:
            break;
    }
    return orders;
};
exports.filterOrders = filterOrders;

const getOrders = async (page, filter, orderID) => {
    let query = {};
    let orders = await Order.find(query).lean();
    
    if (filter) {
        orders = await filterOrders(orders, filter);
    }
    orders = sortOrdersByTime(orders);

    if (orderID) {
        orderID = orderID.toLowerCase();
        orders = orders.filter(order => {
            const id = order._id.toString().slice(-6);
            return id.includes(orderID);
        });
    }
    const ordersCount = orders.length;
    orders = orders.slice((page - 1) * 9, (page - 1) * 9 + 9);
    return {
        orders: orders,
        orderCount: ordersCount,
    };
};
exports.getOrders = getOrders;

const sortOrdersByTime = (orderData) => {
    const sortedOrders = [...orderData];

    sortedOrders.sort((a, b) => {
        const timeA = new Date(a.created).getTime();
        const timeB = new Date(b.created).getTime();
        return timeB - timeA;
    });

    return sortedOrders;
};
exports.sortOrdersByTime = sortOrdersByTime;
