const express = require('express');
const { createCart, getCart, myCart } = require('../controllers/cartController');
const router = express.Router();

const {authenticateUser} = require("../middleware/authenticate");
const { authorize } = require('../middleware/authorize');

router.route('/order/new').post(authenticateUser, createCart);
router.route('/order/:id').get(authenticateUser, getCart);
router.route('/order/me').get(authenticateUser, myCart);