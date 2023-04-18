const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
	id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
	name: {
		type: String,
		required: [true, "Please add the product name"]
	},
	desc: {
		type: String,
		required: [true, "Please add the description"]
	},
	price: {
		type: Number,
		required: [true, "Please add the product price"],
		get: getPrice,
		set: setPrice
	},
	image: {
		type: String,
		required: [true, "Please add the contact phone number"]
	},
	category: {
		type: [String],
		required: [true, "Please select a category"]
	},
	rating: {
		type: Number,
		required: true
	},
}, {
	timestamps: true,
})

function getPrice(num) {
	return (num/100).toFixed(2);
}

function setPrice(num) {
	return num * 100
}

module.exports = mongoose.model("Product", productSchema);
