const { Schema, model } = require("mongoose");

const orderSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    client: {
      type: String,
      required: true,
    },
    products: [
      {
        qty: {
          type: Number,
        },
        productId: {
          type: String,
          required:true
        },
      },
    ],
    status: {
      type: String,
      default:'pending'
    },
  },
  {
    timestamps: {createdAt:'dataEntry', updatedAt:'dateProcessed' },
    versionKey: false,
  }
);

module.exports = model("Order", orderSchema);
