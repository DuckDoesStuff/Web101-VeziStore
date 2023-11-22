const express = require("express");
const router = express.Router();

const user_info = [
    {
        id: 123,
        username: "nhung1899",
        email: "nhung1899@gmail.com",
        registeration_date: "2021-05-01",
        membership: "VIP",
    },
    {
        id: 123,
        username: "nhung1899",
        email: "nhung1899@gmail.com",
        registeration_date: "2021-05-01",
        membership: "VIP",
    },
    {
        id: 123,
        username: "nhung1899",
        email: "nhung1899@gmail.com",
        registeration_date: "2021-05-01",
        membership: "VIP",
    },
    {
        id: 123,
        username: "nhung1899",
        email: "nhung1899@gmail.com",
        registeration_date: "2021-05-01",
        membership: "VIP",
    },
    {
        id: 123,
        username: "nhung1899",
        email: "nhung1899@gmail.com",
        registeration_date: "2021-05-01",
        membership: "VIP",
    }
]

router.get("/", function (req, res, next) {
    res.render("admin/account/user-dashboard", {user_info: user_info});
});

module.exports = router;
