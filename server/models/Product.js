const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mainCategory: {
    type: String,
    required: true,
  },
  subCategory: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  brand: {
    type: String,
  },
  images: [
    {
      type: String,
    },
  ],
  description: {
    type: String,
  },
  specifications: {
    type: String,
  },
  stockQuantity: {
    type: Number,
    default: 0,
  },
  featured: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Product', productSchema);
