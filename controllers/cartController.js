const Cart = require("../models/cartModel");
const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");


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
		success: true,
		cart
	})
});

const getCart = asyncHandler(async (req,res) => {
	const cart = await Cart.findById(req.params.id).populate('user', 'name email')

	if(!cart) {
		res.status(404);
    throw new Error("No order found in this cart");
	}

	res.status(200).json({
		success: true,
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
		status: "success",
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
		success: true,
		totalAmount,
		carts
	})
});

const updateCart = asyncHandler(async (req,res) => {
	const cart = await Cart.findById(req.params.id);

	if(cart.orderStatus === 'Delivered') {
		res.status(400);
    throw new Error("the products have been delivered");
	}

	cart.orderedItems.forEach(async item => {
		await updateStock(item.product, item.quantity)
	})

	cart.orderStatus = req.body.status,
	cart.deliveredAt = Date.now()

	await cart.save()

	res.status(200).json({
		success: true
	})
})

async function updateStock(id, quantity) {
	const product = await Product.findById(id);
	product.stock = product.stock - quantity;

	await product.save({ validateBeforeSave: false })
}

const deleteCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findById(req.params.id);
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  await cart.deleteOne();
  res.status(200).json({
		success: true,
		cart
	});
});

module.exports = {createCart, getCart, myCart, getAllCarts, updateCart, deleteCart};
