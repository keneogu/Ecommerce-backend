const Product = require("../models/productModel");
require("dotenv").config();
const connectDb = require("../config/connectDb");
const products = require("../config/product");

connectDb();

const seedProducts = async () => {
  try {
    await Product.deleteMany();
    console.log("Products deleted");

    await Product.insertMany(products);
    console.log("All Products are added");

    process.exit();
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
};
seedProducts();
