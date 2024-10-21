const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const friendsdbSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Types.ObjectId, auto:true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    friendId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "blocked"],
      default: "pending",
    },
  },
  { strict: false, timestamps: true, collection: process.env.friendsModel }
);

const friendsDbModal = mongoose.model(
  process.env.friendsModel,
  friendsdbSchema
);
module.exports = friendsDbModal;
