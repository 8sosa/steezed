const mongoose = require('mongoose');
const Seller = require('../models/sellerModel')

const orderProductSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
});

const paymentSchema = new mongoose.Schema({
  paymentAmount: {
    type: Number,
    required: true,
  },
  reference: {
    type: String,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Success', 'Failed', 'Cancelled'],
    default: 'Pending',
  },
});

const orderSchema = new mongoose.Schema({
  shopper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shopper',
    required: true,
  },
  products: {
    type: [orderProductSchema],
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  payment: {
    type: [paymentSchema],
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
});

// Middleware to update the order status when the corresponding seller status changes
orderSchema.pre('save', async function (next) {
  const orderProduct = this.products[0];
  
  if (orderProduct) {
    const seller = await Seller.findById(orderProduct.seller);
    
    if (seller) {
      orderProduct.status = seller.orders[0].status;
    }
  }
  
  next();
});

// Middleware to update the order status based on the most common status among products
orderSchema.pre('save', async function (next) {
  const orderProductStatuses = this.products.map(product => product.status);
  
  if (orderProductStatuses.length > 0) {
    const mostCommonStatus = getMostCommonStatus(orderProductStatuses);
    this.status = mostCommonStatus;
  }

  next();
});

// Helper function to get the most common status from an array of statuses
function getMostCommonStatus(statuses) {
  const statusCount = {};
  let mostCommonStatus = null;
  let maxCount = 0;

  statuses.forEach(status => {
    statusCount[status] = (statusCount[status] || 0) + 1;

    if (statusCount[status] > maxCount) {
      mostCommonStatus = status;
      maxCount = statusCount[status];
    }
  });
  return mostCommonStatus;
}

module.exports = mongoose.model('Order', orderSchema);
