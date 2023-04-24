const express = require('express');
const { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, userProfile, updatePassword, updateProfile, getAllUsers, getUserDetails, updateUser } = require('../controllers/userController');
const router = express.Router();

const {authenticateUser} = require("../middleware/authenticate");
const { authorize } = require('../middleware/authorize');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);
router.route('/logout').get(logoutUser);
router.route('/me').get(authenticateUser, userProfile);
router.route('/me/update').put(authenticateUser, updateProfile);
router.route('/password/update').put(authenticateUser, updatePassword);
router.route('/admin/users').get(authenticateUser, authorize('admin'), getAllUsers);
router.route('/admin/user/:id')
						.get(authenticateUser, authorize('admin'), getUserDetails)
						.put(authenticateUser, authorize('admin'), updateUser);


module.exports = router;
