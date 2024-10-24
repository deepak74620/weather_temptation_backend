const { BSON, ObjectId } = require("bson");
const usersDbModal = require("./users.model");
const timestamp = new Date().toISOString();
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookie = require('cookie');
const friendsDbModal = require("../friends/friends.model");
dotenv.config();

const usersController = {
  getUserDetails: async (req, res) => {
    try {
      if (!req?.user || !req?.user?.id) {
        return res.status(500).json({ message: "Unauthorised" });
      }
      const user = await usersDbModal.findById(req.user.id).select('-password');

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({
        data: user,
        status: true,
        timestamp,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        data: {
          message: error.message,
        },
        success: false,
        timestamp,
      });
    }
  },
  getAllUsers: async (req, res) => {
    try {
      if (!req?.user || !req?.user?.id) {
        return res.status(500).json({ message: "Unauthorised" });
      }
      const userId = new ObjectId(req.user.id);

    const friendsList = await friendsDbModal.find({ userId: userId }, { friendId: 1 });

    const friendIds = friendsList.map(friend => friend.friendId);

    const users = await usersDbModal.aggregate([
      {
        $match: {
          _id: { $ne: userId, $nin: friendIds }  
        }
      },
      {
        $project: {
          password: 0, 
        }
      }
    ]);

      return res.status(200).json({
        data: {
          ref:users
        },
        status: true,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        data: {
          message: error.message,
        },
        success: false,
        timestamp,
      });
    }
  },
  registerUser: async (req, res) => {},

  updateUserPassword : async (req,res)=>{
    // console.log(req.body);
    
    const { email, currentPassword, newPassword } = req.body;

    try {
      console.log("hiii");
      // Find user by email
      let user = await usersDbModal.findOne({ email });
      console.log(user);
      

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if the current password is correct
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      // Hash the new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      console.log(user.password);
      // Update the password in the database
      // user.password = hashedNewPassword;
      console.log(hashedNewPassword);
      
      console.log(user.password);
      
      // await user.save();
      const ref =await usersDbModal.findOneAndUpdate(
        { email },
        { password: hashedNewPassword },
        { new: true } // Return the updated document
      );
      if(!ref){
        console.log('error ref')
        throw new Error('Something went wrong!')
      }
      console.log("User password updated in DB");

      console.log(user.password);
      

      console.log(user);


      return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server error" });
    }
  },
  loginUser: async (req, res) => {
    const { email, password } = req.body;

    try {
      let user = await usersDbModal.findOne({ email });

      if (!user) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user = new usersDbModal({
          _id: new BSON.ObjectId(),
          email,
          password: hashedPassword,
        });
        await user.save();
      } else {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: "Invalid credentials" });
        }
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        algorithm: "HS512",
        expiresIn: "2d",
      });
      res.setHeader('Set-Cookie', cookie.serialize('token', token, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        maxAge: 3600,
        path: '/',
      }));

      return res.status(200).json({
        token,
        user: { id: user._id, email: user.email },
        status: true,
        timestamp,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = usersController;
