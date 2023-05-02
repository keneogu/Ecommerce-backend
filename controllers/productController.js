const asyncHandler = require("express-async-handler");
const Features = require("../features/features");
const Product = require("../models/productModel");

const getProducts = asyncHandler(async (req, res) => {

  const perPage = 4;
  const productCount = await Product.countDocuments()

  const features = new Features(Product.find(), req.query).search().filter().pagination(perPage);
  const products = await features.query;

  setTimeout(() => {
    res.status(200).json({
      productCount,
      perPage,
      products
    });
  }, 1000)
});

const createProduct = asyncHandler(async (req, res) => {
  req.body.user = req.user.id
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.status(200).json(product);
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatedProduct);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await Product.remove();
  res.status(200).json(product);
});

const createReview = asyncHandler(async(req,res) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    r => r.user.toString() === req.user._id.toString()
  )

  if(isReviewed) {
    product.reviews.forEach(review => {
      if(review.user.toString() === req.user.id.toString()) {
        review.comment = comment;
        review.rating = rating
      }
    })
  }else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length
  }

  product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

  await product.save({ validateBeforeSvae: false });

  res.status(200).json({
    success: true
  })
});

const getAllReviews = asyncHandler(async(req,res) => { 
  const product = await Product.findById(req.query.id);

  res.status(200).json({
    success: true,
    reviews: product.reviews
  })
});

const deleteReview = asyncHandler(async(req,res) => {
  const product = await Product.findById(req.query.productId);

  const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());

  const numOfReviews = reviews.length;

  const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

  await Product.findByIdAndUpdate(req.query.productId, {
    reviews,
    ratings,
    numOfReviews
  }, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  })

  res.status(200).json({
    success: true,
    reviews: product.reviews
  })
});

module.exports = {
  getProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  createReview,
  getAllReviews,
  deleteReview
};
