const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    picture: { type: String },
    first_name: { type: String, default: "" },
    last_name: { type: String, default: "" },
    address: { type: String, default: "" },
    googleId: { type: String, default: "" },
    facebookId: { type: String, default: "" },
    verified: { type: Boolean, default: false },
    password: { type: String, required: true },
    phone: { type: String, default: "" },
    isAdmin: { type: Boolean, default: false},
    //wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    created: { type: Date, default: Date.now },
    cart: {type: mongoose.Schema.Types.ObjectId, ref: "Cart"},
    order: [{type: mongoose.Schema.Types.ObjectId, ref: "Order"}],
});

userSchema.pre("save", async function (next) {
    try {
        if (this.isModified('password') || this.isNew) {
            const hashedPassword = await bcrypt.hash(this.password, 10);
            this.password = hashedPassword;
            this.created = new Date();
        }
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.isValidPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

const User = mongoose.model("User", userSchema, "user");

module.exports = User;
