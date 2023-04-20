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

const getProduct = asyncHandler(async (req,res) => {
	const product = await Product.findById(req.params.id);
	if(!product) {
		res.status(404);
		throw new Error("Product not found");
	}
	res.status(200).json(product);
});

module.exports = {getProducts, createProduct, getProduct, updateProduct, deleteProduct}