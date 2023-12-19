const mongoose = require('mongoose');

const shopperSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true,
    unique: true
  },
  image: {
    data: Buffer,
    contentType: String
  },
  imageName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true
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
  address: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('Shoppers', shopperSchema);