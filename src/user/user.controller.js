const userService = require("./user.service");

const dashboard = async (req, res, next) => {
    res.render("admin/account/user-dashboard", {
        title:
            "Vezi Store | User Dashboard",
    });
};

exports.dashboard = dashboard;

const getUsers = async (req, res, next) => {
    const page = req.query.page || 1;
    const sort = req.query.sort || 0;
    const username = req.query.username || "";
    const email = req.query.email || "";

    res.json(
        await userService.getUsers(
            page,
            sort,
            username,
            email,
        )
    );
};
exports.getUsers = getUsers;

const userDetail = async (req, res, next) => {
    const userInfo = await userService.getUserById(req.params.id);
    res.render("admin/account/user-info", {
        title:
            "Vezi Store | User Detail",
        userInfo: userInfo,
    });
};
exports.userDetail = userDetail;