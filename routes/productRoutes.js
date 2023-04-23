const express = require("express");
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const {authenticateUser} = require('../middleware/authenticate');
const { authorize } = require('../middleware/authorize');
const router = express.Router();

router.route("/products").get(getProducts);
router.route("/admin/products/new").post(authenticateUser, authorize('admin'), createProduct);
router.route("/product/:id").get(getProduct);
router.route("/admin/product/:id").put(authenticateUser, authorize('admin'), updateProduct).delete(authenticateUser, authorize('admin'), deleteProduct);

module.exports = router;
