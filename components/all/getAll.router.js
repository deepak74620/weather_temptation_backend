const getAllRouter  = require("express").Router();

const {authenticateUser,authenticateToken} = require("../../middlewares/auth");
// const usersController = require('./users.controller')
const getAllController = require('./getAll.controller')
const jwt = require("jsonwebtoken");

getAllRouter.get(
    "/foods",
    authenticateToken,
    getAllController.getAllFoods
);
getAllRouter.get(
    "/destinations",
    authenticateToken,
    getAllController.getAllDestinations
);
getAllRouter.post(
    "/toggleFav",
    authenticateToken,
    getAllController.toggleFav
);
// getAllRouter.post(
//     "/addType",
//     // authenticateToken,
//     getAllController.addType
// );

module.exports = getAllRouter;