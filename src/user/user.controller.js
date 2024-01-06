const userService = require("./user.service");

const dashboard = async (req, res, next) => {
    const user = await userService.getUserById(req.user.id);
    res.render("admin/account/user-dashboard", {
        title:
            "Vezi Store | User Dashboard",
        showSideBar: true,
        user: req.user,
        picture: user.picture,
        mode: false,
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
    const user = await userService.getUserById(req.user.id);
    res.render("admin/account/user-info", {
        title:
            "Vezi Store | User Detail",
        userInfo: userInfo,
        showSideBar: true,
        user: req.user,
        picture: user.picture,
        mode: false,
    });
};
exports.userDetail = userDetail;

const adminProfile = async (req, res, next) => {
	const user = await userService.getUserById(req.user.id);
    res.render("admin/setting/admin-profile", {
        title:
            "Vezi Store | Admin Profile",
        showSideBar: true,
        mode: false,
        user: req.user,
		picture: user.picture,
		first_name: user.first_name,
		last_name: user.last_name,
		email: user.email,
		address: user.address,
		phone: user.phone,
	});
}
exports.adminProfile = adminProfile;

const newAdminAccount = async (req, res, next) => {
    const user = await userService.getUserById(req.user.id);
    res.render("admin/setting/admin-register", {
        title:
            "Vezi Store | Admin Create New Accout",
            showSideBar: true,
            mode: false,
            user: req.user,
            picture: user.picture,
	});

}
exports.newAdminAccount = newAdminAccount;
