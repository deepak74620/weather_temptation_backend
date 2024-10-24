const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const foodsdbSchema = new mongoose.Schema(
	{
		_id: { type: mongoose.Types.ObjectId },  // Unique identifier for each food entry
		name: { type: String, required: true },  // Food name, required field
		imageUrl: { type: String, required: true },  // URL for the food image, required field
		season: { 
			type: String, 
			enum: ['spring', 'summer', 'rainy', 'fall', 'winter'],  // Restrict season to these values
			required: true 
		},
		description: { type: String },  // Optional description field
		type:{type:String,default:'food'},
		isFav:{type:Boolean,default:false}
	},
	{ 
		strict: false,  // Allows adding additional fields beyond the schema
		timestamps: true,  // Automatically adds 'createdAt' and 'updatedAt'
		collection: process.env.foodsModel // Specifies the collection name from the environment variable
	}
);

const destinationsdbSchema = new mongoose.Schema(
	{
		_id: { type: mongoose.Types.ObjectId },  // Unique identifier for each food entry
		name: { type: String, required: true },  // Food name, required field
		imageUrl: { type: String, required: true },  // URL for the food image, required field
		season: { 
			type: String, 
			enum: ['spring', 'summer', 'rainy', 'fall', 'winter'],  // Restrict season to these values
			required: true 
		},
		type:{type:String,default:'destination'},
		isFav:{type:Boolean,default:false},
		description: { type: String },  // Optional description field
	},
	{ 
		strict: false,  // Allows adding additional fields beyond the schema
		timestamps: true,  // Automatically adds 'createdAt' and 'updatedAt'
		collection: process.env.destinationsModel // Specifies the collection name from the environment variable
	}
);

const foodsDbModal = mongoose.model(process.env.foodsModel, foodsdbSchema);
const destinationsDbModal = mongoose.model(process.env.destinationsModel, destinationsdbSchema);
module.exports = {foodsDbModal,destinationsDbModal};

