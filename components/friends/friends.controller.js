const { BSON, ObjectId } = require("bson");
const timestamp = new Date().toISOString();
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookie = require("cookie");
const friendsDbModal = require("./friends.model");
dotenv.config();

const friendsController = {
  sendFriendRequest: async (req, res) => {
    try {
      const { friendId } = req.body;
      const userId = req.user.id;

      if (friendId === userId) {
        return res
          .status(400)
          .json({ message: "You can't send a friend request to yourself." });
      }

      // Check if friendship already exists
      const existingFriendship = await friendsDbModal.findOne({
        userId:userId,
        friendId:friendId,
        status: {$in:['accepted','pending' ]}
      })

      if (existingFriendship) {
        return res
          .status(400)
          .json({ message: "Friendship request already exists." });
      }

      const newFriendship = new friendsDbModal({
        userId:userId,
        friendId:friendId
      });

      await newFriendship.save();
      return res.status(201).json({ message: "Friend request sent." });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server error." });
    }
  },

  // Accept friend request
  acceptFriendRequest: async (req, res) => {
    try {
      const { requestId } = req.body;
      const userId = req.user.id;

      const friendRequest = await Friends.findOne({
        _id: requestId,
        recipient: userId,
      });

      if (!friendRequest) {
        return res.status(404).json({ message: "Friend request not found." });
      }

      friendRequest.status = "accepted";
      await friendRequest.save();

      return res.status(200).json({ message: "Friend request accepted." });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server error." });
    }
  },

  // Get friend list
  getFriends: async (req, res) => {
    try {
      const userId = req.user.id;
      const {status} =req.query
      const queryparams = {
        userId:new ObjectId(userId),
        status:status
      }
      const friends = await friendsDbModal.aggregate([
        {
          $match:queryparams,
        },
        {
          $lookup: {
            from: "users", 
            localField: "friendId",
            foreignField: "_id", 
            as: "friendDetails", 
          },
        },
        {
          $unwind: "$friendDetails", 
        },
        {
          $project: {
            "friendDetails.password": 0, 
            // "friendDetails": 1, 
          },
        },
      ]);
      console.log(friends)

      return res.status(200).json({ 
        data:{
          ref:friends
        },
        status: true,
        timestamp,
       });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server error." });
    }
  },
};

module.exports = friendsController;
