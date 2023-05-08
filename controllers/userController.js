const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const tokenHandler = require("../middleware/tokenHandler");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary")

const registerUser = asyncHandler(async (req, res) => {

  const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: 'Avatars',
    width: 150,
    crop: "scale"
  })
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already exist");
  }

  // const hashedPassword = await bcrypt.hash(password, 10);
  // console.log(hashedPassword);

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: result.public_id,
      url: result.secure_url,
    },
  });

  tokenHandler(user, 200, res);
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    res.status(401);
    throw new Error("email or password not valid");
  }

  const isPassword = await user.comparePassword(password);
  if (!isPassword) {
    res.status(401);
    throw new Error("Incorrect Password");
  }

  tokenHandler(user, 200, res);
});

const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    res.status(404);
    throw new Error("User email not found");
  }

  const resetToken = user.passwordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is : \n\n${resetUrl}\n\n if you did request for it ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Recovery",
      message,
    });
    res.status(200).json({
      succes: true,
      message: `Email send to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new Error(error.message, 500));
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if(!user) {
    res.status(400);
    throw new Error("Password has been expired");
  }

  if(req.body.password !== req.body.confirmPassword) {
    res.status(400);
    throw new Error("Password does not match");
  }

  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  tokenHandler(user, 200, res)

});

const updatePassword = asyncHandler(async(req,res) => {
  const user = await User.findById(req.user.id).select('+password');

  const isMatched = await user.comparePassword(req.body.oldPassword)
  if(!isMatched) {
    res.status(400);
    throw new Error("Old password is incorrect");
  }

  user.password = req.body.password;
  await user.save();
  tokenHandler(user, 200, res)
})

const userProfile = asyncHandler(async (req,res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user
  })
});

const updateProfile = asyncHandler(async(req,res) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: false,
    useFindAndModify: false
  })

  res.status(200).json({
    success: true
  })
});

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    message: "User logged out",
  });
});

const getAllUsers = asyncHandler(async (req,res) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users
  })
})

const getUserDetails = asyncHandler(async (req,res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(401);
    throw new Error(`user id: ${req.params.id} not found`);
  }

  res.status(200).json({
    success: true,
    user
  })

});

const updateUser = asyncHandler(async(req,res) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role
  }

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  })

  res.status(200).json({
    success: true,
    user
  })
});

const deleteUser = asyncHandler(async (req,res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(401);
    throw new Error(`user id: ${req.params.id} not found`);
  }

  await user.deleteOne({ _id: req.params.id });

  res.status(200).json({
    success: true,
  })

});

module.exports = { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, userProfile, updatePassword, updateProfile, getAllUsers, getUserDetails, updateUser, deleteUser };
