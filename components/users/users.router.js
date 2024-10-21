const usersRouter  = require("express").Router();

const {authenticateUser,authenticateToken} = require("../../middlewares/auth");
const usersController = require('./users.controller')
const jwt = require("jsonwebtoken");

usersRouter.get(
    "/me",
    authenticateToken,
    usersController.getUserDetails
);
usersRouter.get(
    "/getAllUsers",
    authenticateToken,
    usersController.getAllUsers
);
usersRouter.post(
    "/login",
    // authenticateToken,
    usersController.loginUser
);

module.exports = usersRouter;