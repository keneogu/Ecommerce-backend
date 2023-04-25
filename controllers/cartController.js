const Cart = require("../models/cartModel");
const asyncHandler = require("express-async-handler");


const createCart = asyncHandler(async (req, res) => {
	const { orderedItems, shippingInfo, itemsPrice, taxPrice, shippingPrice, totalPrice, paymentInfo } = req.body;

	const cart = await Cart.create({
		orderedItems,
		shippingInfo,
		itemsPrice,
		taxPrice, 
		shippingPrice, 
		totalPrice, 
		paymentInfo,
		paidAt: Date.now(),
		user: req.user._id
	})
	res.status(200).json({
		success,
		cart
	})
});

module.exports = {createCart};
