const mongoose = require("mongoose");

const db = async()=> {
	try {
		await mongoose.connect(process.env.ATLAS_URI, {
			connectTimeoutMS: 60000,
		});
		console.log("Connected to MongoDB");
	} catch (error) {
		console.log(error);
	}
}

module.exports = db;