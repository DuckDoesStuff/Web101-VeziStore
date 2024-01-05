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
    const name = req.query.name || "";
    const email = req.query.email || "";

    res.json(
        await userService.getUsers(
            page,
            sort,
            name,
            email,
        )
    );
};
exports.getUsers = getUsers;