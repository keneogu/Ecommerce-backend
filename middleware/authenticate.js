const User = require("../models/userModel");
const jwt = require('jsonwebtoken');
const asyncHandler = require("express-async-handler");

const authenticateUser = asyncHandler(async (req,res, next) => {
	const {token} = req.cookies

	if(!token) {
		res.status(401);
		throw new Error("User not authorized");
	}

	const decoded = jwt.verify(token, process.env.SECRET_TOKEN)
	req.user = await User.findById(decoded.id);

	next()
});

module.exports = {authenticateUser};
