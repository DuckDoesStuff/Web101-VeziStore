const crypto = require('crypto');
const dotenv = require("dotenv");
const moment = require('moment');
dotenv.config();



const paymentProcess = async (req, res, next) => {
	console.log("here")
	process.env.TZ = 'Asia/Ho_Chi_Minh';
    
	let date = new Date();
	let createDate = moment(date).format('YYYYMMDDHHmmss');
	
	let ipAddr = req.headers['x-forwarded-for'] ||
							req.connection.remoteAddress ||
							req.socket.remoteAddress ||
							req.connection.socket.remoteAddress;

	let tmnCode = process.env.VNP_TMN_CODE;
	let secretKey = process.env.VNP_HASH_SECRET;
	let vnpUrl = process.env.VNP_URL;
	let returnUrl = "http://localhost:3000";
	let orderId = moment(date).format('DDHHmmss');

	let amount = 100000;
	let bankCode = "";
	let locale = "";
	if(locale === null || locale === ''){
			locale = 'vn';
	}
	let currCode = 'VND';
	let vnp_Params = {};
	vnp_Params['vnp_Version'] = '2.1.0';
	vnp_Params['vnp_Command'] = 'pay';
	vnp_Params['vnp_TmnCode'] = tmnCode;
	vnp_Params['vnp_Locale'] = locale;
	vnp_Params['vnp_CurrCode'] = currCode;
	vnp_Params['vnp_TxnRef'] = orderId;
	vnp_Params['vnp_OrderInfo'] = 'Thanh toan Vezi GD:' + orderId;
	vnp_Params['vnp_OrderType'] = 'other';
	vnp_Params['vnp_Amount'] = amount * 100;
	vnp_Params['vnp_ReturnUrl'] = returnUrl;
	vnp_Params['vnp_IpAddr'] = ipAddr;
	vnp_Params['vnp_CreateDate'] = createDate;
	if(bankCode !== null && bankCode !== ''){
			vnp_Params['vnp_BankCode'] = bankCode;
	}

	vnp_Params = sortObject(vnp_Params);

	let querystring = require('qs');
	let signData = querystring.stringify(vnp_Params, { encode: false });
	let hmac = crypto.createHmac("sha512", secretKey);
	let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex"); 

	vnp_Params['vnp_SecureHash'] = signed;
	vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

	console.log("vnp_Params", vnp_Params);
	console.log("vnpUrl", vnpUrl);

	return res.json({
		url: vnpUrl,
	});
}
exports.paymentProcess = paymentProcess;


function sortObject(obj) {
	let sorted = {};
	let str = [];
	let key;
	for (key in obj){
		if (obj.hasOwnProperty(key)) {
		str.push(encodeURIComponent(key));
		}
	}
	str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}