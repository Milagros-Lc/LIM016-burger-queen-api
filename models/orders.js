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
  // products: [

  //   {
  //     productId: {
  //       type: String,
  //       required: true,
  //     },
  //   },
  //   {
  //     qty: {
  //       type: Number,
  //       required: true,
  //     },
  //   },

  // ],

}, {
  timestamps: true,
});

module.exports = model('Order', orderSchema);
