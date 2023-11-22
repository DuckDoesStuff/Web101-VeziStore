const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();

const db = async()=> {
	try {
		await mongoose.connect(process.env.ATLAS_URI).then((dbo)=>{
  		console.log("DB connected")
		});
	} catch (error) {
		console.log(error);
	}
}

module.exports = db;