const express = require('express');
const { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, userProfile, updatePassword } = require('../controllers/userController');
const router = express.Router();

const {authenticateUser} = require("../middleware/authenticate");

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);
router.route('/logout').get(logoutUser);
router.route('/me').get(authenticateUser, userProfile);
router.route('/password/update').put(authenticateUser, updatePassword);

module.exports = router;
