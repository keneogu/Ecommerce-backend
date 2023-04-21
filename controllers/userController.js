const User = require('../models/userModel');
const asyncHandler = require("express-async-handler")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const registerUser = asyncHandler( async(req,res) => {
	const {name,email,password} = req.body;
	if(!name || !email || !password) {
		res.status(400)
		throw new Error("All fields are mandatory")
	}
	const userAvailable = await User.findOne({ email });
	if(userAvailable) {
		res.status(400)
		throw new Error("User already exist")
	}

	const hashedPassword = await bcrypt.hash(password, 10);
	console.log(hashedPassword);

	const user = await User.create({
		name,
		email,
		password: hashedPassword,
		avatar: {
			public_id: 'Avatars/kene4_ryggsv',
			url: 'https://res.cloudinary.com/keneogu/image/upload/v1682087314/Avatars/kene4_ryggsv.jpg'
		}
	});

	res.status(201).json(user)
});

module.exports = {registerUser}
