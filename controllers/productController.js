const asyncHandler = require("express-async-handler")
const Product = require("../models/productModel")

const getProducts = asyncHandler(async (req,res) => {
	const products = await Product.find();
	res.status(200).json(products)
});

const createProduct = asyncHandler(async (req,res) => {
	const product = await Product.create(req.body);
	res.status(201).json(product);
})

module.exports = {getProducts, createProduct}