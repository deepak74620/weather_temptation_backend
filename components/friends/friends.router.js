const friendsRouter  = require("express").Router();

const {authenticateUser,authenticateToken} = require("../../middlewares/auth");
const friendsController = require('./friends.controller')
const jwt = require("jsonwebtoken");

friendsRouter.get(
    "/friends",
    authenticateToken,
    friendsController.getFriends
);
friendsRouter.post(
    "/sendFriendRequest",
    authenticateToken,
    friendsController.sendFriendRequest
);

module.exports = friendsRouter;