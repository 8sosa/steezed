const mongoose = require('mongoose');

const cartProductSchema = new mongoose.Schema({
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1
    }
});

const cartSchema = new mongoose.Schema({
  shopper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: {
    type: [cartProductSchema],
    required: true
  },
  total: {
    type: Number,
    default: 0,
    required: true
  }
});

module.exports = mongoose.model('Cart', cartSchema);