const express = require("express");
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const {authenticateUser} = require('../middleware/authenticate');
const router = express.Router();

router.route("/products").get(getProducts);
router.route("/admin/products/new").post(authenticateUser, createProduct);
router.route("/product/:id").get(getProduct);
router.route("/admin/product/:id").put(authenticateUser, updateProduct).delete(authenticateUser, deleteProduct);

module.exports = router;
