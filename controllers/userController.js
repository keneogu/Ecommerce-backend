const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const tokenHandler = require("../middleware/tokenHandler");
const sendEmail = require("../utils/sendEmail");

const registerUser = asyncHandler(async (req, res) => {
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

  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    avatar: {
      public_id: "Avatars/kene4_ryggsv",
      url: "https://res.cloudinary.com/keneogu/image/upload/v1682087314/Avatars/kene4_ryggsv.jpg",
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

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    message: "User logged out",
  });
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
    user.resetPasswordToken = undefind;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new Error(error.message, 500));
  }
});

module.exports = { registerUser, loginUser, logoutUser, forgotPassword };
