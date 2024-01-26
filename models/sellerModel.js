const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  productName: {
    type: String,
  },
  price: {
    type: Number,
  },
  quantity: {
    type: Number,
  }
});

const sellerSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true
  },
  orders: [
    {
      product: {
        type: productSchema,
        ref: 'Product',
      },
      quantity: {
        type: Number,
        required: true
      },
      status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
      },
      shopper: {
        type: String,
        required: true,
      },
      orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
      },
    }
  ],
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  shopName: {
    type: String,
    required: true,
    unique: true
  },
  shopAddress: {
    type: String,
    required: true,
  },
  shopDescription: {
    type: String,
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0,
  }
});

module.exports = mongoose.model('Sellers', sellerSchema);