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
  },
  dateEntry: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  versionKey:false,
});

module.exports = model('Product', productSchema);
