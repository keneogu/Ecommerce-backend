const express = require('express');
const { createCart, getCart, myCart, getAllCarts, updateCart, deleteCart } = require('../controllers/cartController');
const router = express.Router();

const {authenticateUser} = require("../middleware/authenticate");
const { authorize } = require('../middleware/authorize');

router.route('/order/new').post(authenticateUser, createCart);
router.route('/order/:id').get(authenticateUser, getCart);
router.route('/order/me').get(authenticateUser, myCart);
router.route('/admin/orders/').get(authenticateUser, authorize('admin'), getAllCarts);
router.route('/admin/order/:id')
						.put(authenticateUser, authorize('admin'), updateCart)
						.delete(authenticateUser, authorize('admin'), deleteCart);

module.exports = router;
