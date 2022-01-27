const { Schema, model } = require('mongoose');

const orderSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  client: {
    type: String,
    required: true,
  },
  products: [{
    qty: {
      type: Number,
    },
    productId: {
      type: String,
    },
  }],

}, {
  timestamps: true,
  versionKey: false,
});

module.exports = model('Order', orderSchema);
