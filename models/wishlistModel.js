const mongoose = require('mongoose');

const wishlistProductSchema = new mongoose.Schema({
  product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
  }
});
const wishlistSchema = new mongoose.Schema({
  shopper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shopper',
    required: true,
  },
  products: 
    {
      type: [wishlistProductSchema],
      required: true
    }
});

module.exports = mongoose.model('Wishlist', wishlistSchema);