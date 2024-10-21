const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const usersdbSchema = new mongoose.Schema(
	{
		_id: { type: mongoose.Types.ObjectId },
        
	},
	{ strict: false, timestamps:true , collection: process.env.usersModel }
);

const usersDbModal = mongoose.model(process.env.usersModel, usersdbSchema);
module.exports = usersDbModal;
