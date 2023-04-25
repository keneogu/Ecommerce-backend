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

const getCart = asyncHandler(async (req,res) => {
	const cart = await Cart.findById(req.params.id).populate('user', 'name email')

	if(!cart) {
		res.status(404);
    throw new Error("No product in cart");
	}

	res.status(200).json({
		succes: true,
		cart
	})
});

const myCart = asyncHandler(async (req,res) => {
	const cart = await Cart.find({ user: req.user.id })

	if(!cart) {
		res.status(404);
    throw new Error("No product in cart");
	}

	res.status(200).json({
		succes: true,
		cart
	})
});

const getAllCarts = asyncHandler(async (req,res) => {
	const carts = await Cart.find()

	let totalAmount = 0;

	carts.forEach(cart => {
		totalAmount += cart.totalPrice
	})

	res.status(200).json({
		succes: true,
		totalAmount,
		carts
	})
});

module.exports = {createCart, getCart, myCart, getAllCarts};
