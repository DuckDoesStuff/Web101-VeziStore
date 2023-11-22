const express = require("express");
const router = express.Router();

const user_info = {
    id: 123,
    username: "nhung1899",
    email: "nhung1899@gmail.com",
    phone: "0123456789",
    address: "79 Au Co P.14 Q.11 TP.HCM",
    ordered:[
        {
            id:"G472630",
            date: "11/10/2023",
            total: "50",
            payment_status: "Done",
            ship_status: "Done",
        }
    ]
}

router.get("/", function (req, res, next) {
    res.render("admin/account/user-info", {user_info:user_info});
});

module.exports = router;
