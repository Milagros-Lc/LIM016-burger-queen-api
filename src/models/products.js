const { Schema, model } = require('mongoose');

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  image: {
    type: String, 
  },
  type: {
    type: String, 
  }
}, {
  timestamps: true,
});

module.exports = model('Product', productSchema);
