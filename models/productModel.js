const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: [true, "Please add the product name"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    desc: {
      type: String,
      required: [true, "Please add the description"],
    },
    price: {
      type: Number,
      required: [true, "Please add the product price"],
      default: 0.0,
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    category: {
      type: String,
      required: [true, "Please select a category"],
      enum: {
        values: [
          "Electronics",
          "Accessories",
          "Beverages",
          'Food/Fruit',
          "Fashion",
          "Cosmetics",
          "Phones-tablets",
          "Computing",
          "Beauty",
          "Furniture",
          "Home-appliances",
          "Sports",
        ],
      },
    },
    ratings: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      required: [true, "Please add product stock"],
      maxlength: [10, "Product stocked cannot exceed 10"],
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          required: true,
          ref: "User",
        },
        name: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
    numOfReviews: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
