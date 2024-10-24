const { BSON, ObjectId } = require("bson");
const tripsDbModal = require("./trips.model");
const timestamp = new Date().toISOString();
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookie = require("cookie");
const friendsDbModal = require("../friends/friends.model");
// const favouriteDbModal = require("./favourite.model");
dotenv.config();

const tripsController = {
  getAllMyTrips: async (req, res) => {
    try {
      const userId = req.user.id;
      if (!userId) {
        throw new Error("User Id Not Provided");
      }
      const {pageNumber =1,pageSize = 5} = req.query
      const page = parseInt(pageNumber);
      const perPage = parseInt(pageSize);
      const sortBy = { createdAt: -1 };
      const skipCount = (page - 1) * perPage;
      let queryParams = {
        userId: new ObjectId(userId),
      }
      const totalItems = await favouriteDbModal.countDocuments(queryParams)
      const totalPages = Math.ceil(totalItems / perPage);
      const allTrips = await tripsDbModal.aggregate([
        {
          $match: queryParams,
        },
        {
          $sort: sortBy,
        },
        {
          $skip: skipCount,
        },
        {
          $limit: perPage,
        },
      ]);
      return res.status(200).json({
        data: {
          ref: allTrips,
          totalItems:totalItems,
          totalPages:totalPages,
          currentPage:page
        },
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
  createTrip: async (req, res) => {
    try {
      const userId = req.user.id;
      if (!userId) {
        throw new Error("User Id Not Provided");
      }
      const { name, locationId, foodIds, hotelIds, members } = req.body;
      const trip = new tripsDbModal({
        name,
        createdBy: req.user._id,
        members,
        location: locationId,
        foods: foodIds,
        hotels: hotelIds,
      });

      await trip.save();
      return res.status(200).json({
        data: {
          ref: trip,
        },
        success: true,
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
  addMembersToTrip: async (req, res) => {
    try {
      const userId = req.user.id;
      if (!userId) {
        throw new Error("User Id Not Provided");
      }
      const { id, members } = req.body;
      const isTrip = await tripsDbModal.findOne({ id: id });
      if (!isTrip) {
        throw new Error("Trip doesn't exists");
      }
      const newMembers = [...isTrip?.members, ...members];
      const addMembers = await tripsDbModal.findByIdAndUpdate(
        {
          id: id,
        },
        { members: newMembers },
        { new: true }
      );
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
  addToFav: async (req, res) => {
    try {
      const userId = req.user.id;

      if (!userId) {
        throw new Error("User id not provided");
      }
      const { id, isFav,type } = req.body;
      let isAvailable;
      switch (type) {
        case 'trip':
          
          break;
      case 'food':
        break;
        case 'destination':
          break;
        default:
          break;
      }
      const isTrip = await tripsDbModal.findOne({ id: id });
      if (!isTrip) {
        throw new Error("Trip doesn't exists");
      }
      const fav = await favouriteDbModal.findOne({ userId: userId });
      if (!fav) {
        const newFav = new favouriteDbModal({
          userId: userId,
          tripId: id,
          isFav: Number(isFav),
          type:type,
        });
        await newFav.save();

        return res.status(200).json({
          data: {
            ref: newFav,
          },
          success: true,
          timestamp,
        });
      } else {
        const updatedFav = await favouriteDbModal.findOneAndUpdate(
          {
            userId: userId,
          },
          { isFav: Number(isFav) },
          { new: true }
        );
        return res.status(200).json({
          data: {
            ref: updatedFav,
          },
          success: true,
          timestamp,
        });
      }
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
  getAllFavTrips: async (req, res) => {
    try {
      const userId = req.user.id;

      if (!userId) {
        throw new Error("User id not provided");
      }
      const {pageNumber =1,pageSize = 5} = req.query
      const page = parseInt(pageNumber);
      const perPage = parseInt(pageSize);
      const sortBy = { createdAt: -1 };
      const skipCount = (page - 1) * perPage;
      let queryParams = {
        userId: new ObjectId(userId),
      }
      const totalItems = await favouriteDbModal.countDocuments(queryParams)
      const totalPages = Math.ceil(totalItems / perPage);
      const allFavTrips = await favouriteDbModal.aggregate([
        {
          $match: queryParams,
        },
        {
          $sort: sortBy,
        },
        {
          $skip: skipCount,
        },
        {
          $limit: perPage,
        },
      ]);
      return res.status(200).json({
        data:{
          ref:allFavTrips,
          totalItems:totalItems,
          totalPages:totalPages,
          currentPage:page
        },
        success:true,
        timestamp
      })
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
};

module.exports = tripsController;
