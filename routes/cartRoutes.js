const express = require('express');
const { createCart } = require('../controllers/cartController');
const router = express.Router();

const {authenticateUser} = require("../middleware/authenticate");
const { authorize } = require('../middleware/authorize');

router.route('/order/new').post(authenticateUser, createCart);