const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    created: { type: Date, default: Date.now },
    cart: {type: mongoose.Schema.Types.ObjectId, ref: "Cart"},
    checkout: [{type: mongoose.Schema.Types.ObjectId, ref: "Checkout"}],
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
