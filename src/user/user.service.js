const User = require("./user.model");

const getUserById = async (id) => {
    const user = await User.findById(id).lean();
    return user;
};
exports.getUserById = getUserById;

const getUsers = async (page, sort, username, email) => {
    let query = {};
    if (username) {
        query.username = { $regex: new RegExp(username, "i") };
    }
    if (email) {
        query.email = { $regex: new RegExp(email, "i") };
    }
    let users = await User.find(query).lean();

    users = sortUsers(users, sort);
    const usersCount = users.length;
    users = users.slice((page - 1) * 9, (page - 1) * 9 + 9);
    return {
        users: users,
        userCount: usersCount,
    };
};
exports.getUsers = getUsers;

const sortUsersByTime = (userData) => {
    const sortedUsers = [...userData];

    sortedUsers.sort((a, b) => {
        const timeA = new Date(a.created).getTime();
        const timeB = new Date(b.created).getTime();
        return timeB - timeA;
    });

    return sortedUsers;
};
exports.sortUsersByTime = sortUsersByTime;

const sortUsersByNameAsc = (userData) => {
    const sortedUsers = [...userData];

    sortedUsers.sort((a, b) => {
        const nameA = a.username.toLowerCase();
        const nameB = b.username.toLowerCase();

        return nameA.localeCompare(nameB);
    });

    return sortedUsers;
};

exports.sortUsersByNameAsc = sortUsersByNameAsc;

const sortUsersByEmailAsc = (userData) => {
    const sortedUsers = [...userData];

    sortedUsers.sort((a, b) => {
        const emailA = a.email.toLowerCase();
        const emailB = b.email.toLowerCase();

        return emailA.localeCompare(emailB);
    });

    return sortedUsers;
};

exports.sortUsersByEmailAsc = sortUsersByEmailAsc;

const sortUsers = (userData, sort) => {
    let users = [...userData];
    switch (sort) {
        case "1":
            users = sortUsersByTime(users);
            break;
        case "2":
            users = sortUsersByNameAsc(users);
            break;
        case "3":
            users = sortUsersByEmailAsc(users);
            break;
        default:
            break;
    }
    return users;
};
exports.sortUsers = sortUsers;
