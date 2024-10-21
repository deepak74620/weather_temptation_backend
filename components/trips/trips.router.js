const tripsRouter  = require("express").Router();

const {authenticateUser,authenticateToken} = require("../../middlewares/auth");
const tripsController = require('./trips.controller')
const jwt = require("jsonwebtoken");

tripsRouter.get(
    "/myTrips",
    authenticateToken,
    tripsController.getAllMyTrips
);
tripsRouter.post(
    "/create",
    authenticateToken,
    tripsController.createTrip
);
tripsRouter.post(
    "/addMembersToTrip",
    authenticateToken,
    tripsController.addMembersToTrip
);
tripsRouter.post(
    "/addToFav",
    authenticateToken,
    tripsController.addToFav
);

tripsRouter.get(
    "/myFavTrips",
    authenticateToken,
    tripsController.getAllFavTrips
);


module.exports = tripsRouter;