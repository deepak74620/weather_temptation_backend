const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const favouritedbSchema = new mongoose.Schema(
	{
		_id: { type: mongoose.Types.ObjectId },
        
	},
	{ strict: false, timestamps:true , collection: process.env.favouriteModel }
);

const favouriteDbModal = mongoose.model(process.env.favouriteModel, favouritedbSchema);
module.exports = favouriteDbModal;
