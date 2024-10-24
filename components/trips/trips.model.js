const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const tripsdbSchema = new mongoose.Schema(
	{
		_id: { type: mongoose.Types.ObjectId },
		name:{type:String,required:true},
		isFav:{type:Boolean,default:false},
		type:{type:String,default:'trip'},
        
	},
	{ strict: false, timestamps:true , collection: process.env.tripsModel }
);

const tripsDbModal = mongoose.model(process.env.tripsModel, tripsdbSchema);
module.exports = tripsDbModal;
