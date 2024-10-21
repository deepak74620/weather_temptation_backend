const jwt = require("jsonwebtoken");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const getUserDetails = async (token) => {
	return {}
};

const authenticateToken = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
	if (token == null) return res.sendStatus(401);
	
  
	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
	  if (err) return res.sendStatus(403); 
	  req.user = user;
	  next();
	});
  };

const authenticateUser = async (req, res, next) => {
	const token = req.header("Authorization");
	const apiKey = req.header("x-api-key");
	if (!apiKey || apiKey != process.env.xApiKey) {
        return res.status(401).json({ message: "Invalid x-api-key" });
	}
    
	if (!token) {
		return res.status(401).json({ message: "Authorization token missing" });
	}

	const jwtToken = token.split(" ")[1];
	const userDetail = await getUserDetails(jwtToken);
	// console.log("userDetail",userDetail)
	if (userDetail !== null && userDetail !== undefined) {
		req.user = userDetail;
		req.jwtToken = jwtToken;
		next();
	} else {
		return res.status(401).json({ message: "Invalid User" });
	}
	//   console.log("Authenticate middleware");
};

module.exports = {authenticateUser,authenticateToken};
