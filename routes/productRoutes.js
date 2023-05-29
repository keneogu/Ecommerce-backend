const express = require("express");
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  createReview,
  getAllReviews,
  deleteReview,
  getAdminProducts,
} = require("../controllers/productController");

const {authenticateUser} = require('../middleware/authenticate');
const { authorize } = require('../middleware/authorize');
const router = express.Router();

router.route("/products").get(getProducts);
router.route("/admin/products/new").post(authenticateUser, authorize('admin'), createProduct);
router.route("/product/:id").get(getProduct);
router.route("/admin/products").get(getAdminProducts);
router.route("/admin/product/:id").put(authenticateUser, authorize('admin'), updateProduct).delete(authenticateUser, authorize('admin'), deleteProduct);
router.route('/review')
              .put(authenticateUser, createReview)
              .delete(authenticateUser, deleteReview);
router.route('/reviews').get(authenticateUser, getAllReviews);

module.exports = router;
