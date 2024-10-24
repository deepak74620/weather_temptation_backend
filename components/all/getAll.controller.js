const { BSON, ObjectId } = require("bson");
const usersDbModal = require("../users/users.model");
const timestamp = new Date().toISOString();
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookie = require('cookie');
const friendsDbModal = require("../friends/friends.model");
const tripsDbModal = require("../trips/trips.model");
const { foodsDbModal, destinationsDbModal } = require("./getAll.model");
// const destinationsDbModal = require("./getAll.model");
const favouritesDbModal = require("../favourite/favourite.model");
dotenv.config();


const getAllController = {
  getAllFoods: async (req, res) => {
    try {
      // Fetch all food items from the database
      const foods = await foodsDbModal.find();

      if (!foods || foods.length === 0) {
        return res.status(404).json({
          message: "No foods found",
          status: false,
          timestamp: new Date().toISOString(),
        });
      }
      //   console.log(foods);

      return res.status(200).json({
        data: foods,
        status: true,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        data: {
          message: error.message,
        },
        status: false,
        timestamp: new Date().toISOString(),
      });
    }
  },

  getAllDestinations: async (req, res) => {
    try {
      // Fetch all food items from the database
      const destinations = await destinationsDbModal.find();

      if (!destinations || destinations.length === 0) {
        return res.status(404).json({
          message: "No destinations found",
          status: false,
          timestamp: new Date().toISOString(),
        });
      }
      //   console.log(foods);

      return res.status(200).json({
        data: destinations,
        status: true,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        data: {
          message: error.message,
        },
        status: false,
        timestamp: new Date().toISOString(),
      });
    }
  },

  toggleFav: async (req, res) => {
    try {
      const userId = req.user.id
      if (!userId) {
        throw new Error('Unauthenticated user')
      }
      const { item } = req.body.body
      let ref;
      
      switch (item?.type) {
        case 'trip':
          ref = await tripsDbModal.findOneAndUpdate(
            { _id: item._id },
            { isFav: !item.isFav },
            { new: true }
          )
          break;
        case 'food':
          ref = await foodsDbModal.findOneAndUpdate(
            { _id: item._id },
            { isFav: !item.isFav },
            { new: true }
          )
          break;
        case 'destination':
          ref = await destinationsDbModal.findOneAndUpdate(
            { _id: item._id },
            { isFav: !item.isFav },
            { new: true }
          )
          break;
        default:
          throw new Error('Invalid item type');
      }
      return res.status(200).json({
        data: ref,
        status: true,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        data: {
          message: error.message,
        },
        status: false,
        timestamp: new Date().toISOString(),
      });
    }
  },

  getPrefered: async(req,res)=>{
    try {
      
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        data: {
          message: error.message,
        },
        status: false,
        timestamp: new Date().toISOString(),
      });
    }
  }


};

module.exports = getAllController;

// addType: async (req, res) => {
//   try {

//     const foodRef = await foodsDbModal.updateMany(
//       {},
//       { $set: { type: 'food', isFav: false } }
//     );
//     const tripRef = await tripsDbModal.updateMany(
//       {},
//       { $set: { type: 'trip', isFav: false } }
//     );
//     const destinationRef = await destinationsDbModal.updateMany(
//       {},
//       { $set: { type: 'destination', isFav: false } }
//     );
//     return res.status(200).json({
//       data: {
//         foodRef: foodRef,
//         tripRef: tripRef,
//         destinationRef: destinationRef
//       },
//       status: true,
//       timestamp: new Date().toISOString(),
//     });

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       data: {
//         message: error.message,
//       },
//       status: false,
//       timestamp: new Date().toISOString(),
//     });
//   }
// },