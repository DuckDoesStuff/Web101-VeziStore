const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();

const db = async()=> {
	try {
		await mongoose.connect(process.env.ATLAS_URI);
		console.log("Connected to MongoDB");
	} catch (error) {
		console.log(error);
	}
}

module.exports = db;