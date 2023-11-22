const express = require("express");
const router = express.Router();
const {addUser, getUsers} = require("./users.controller");

const users = [];

router.get("/", function (req, res, next) {
    res.render("user/account/signUp");
});

const signUp = async (username, password, email) => {
    if (users.some((user) => user.username === username)) {
        return { success: false, message: "Username already exists!" };
    }
    if (users.some((user) => user.email === email)) {
        return { success: false, message: "Email already exists!" };
    } else {
        users.push({ username, password, email });
        return { success: true, message: "Registration successful!" };
    }
};

router.post("/", async (req, res, next) => {
    const { username, password, email } = req.body;

    // Gọi chức năng đăng ký
    const result = await signUp(username, password, email);

    // Trả về kết quả đăng ký
    if (result.success) {
        addUser(req, res);
    } else {
        res.status(400).send(result.message);
    }
});

module.exports = router;
