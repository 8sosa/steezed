const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  imageName: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Category', categorySchema);