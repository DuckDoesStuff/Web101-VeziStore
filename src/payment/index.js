const express = require("express");
const router = express.Router();
const crypto = require('crypto');

router.get("/vnp-ipn", (req, res, next) => {
	const vnp_Params = req.query;
	console.log("vnp_Params", vnp_Params);
	const secureHash = vnp_Params['vnp_SecureHash'];

	delete vnp_Params['vnp_SecureHash'];
	delete vnp_Params['vnp_SecureHashType'];

	vnp_Params = sortObject(vnp_Params);
	const secretKey = process.env.VNP_HASH_SECRET;
	const querystring = require('qs');
	const signData = querystring.stringify(vnp_Params, { encode: false });
	const hmac = crypto.createHmac("sha512", secretKey);
	const signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");     
	 

	if(secureHash === signed){
			var orderId = vnp_Params['vnp_TxnRef'];
			var rspCode = vnp_Params['vnp_ResponseCode'];
			//Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
			res.status(200).json({RspCode: '00', Message: 'success'})
	}
	else {
			res.status(200).json({RspCode: '97', Message: 'Fail checksum'})
	}
})

module.exports = router;