const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const orderSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    client: {
      type: String,
      
    },
    products: [{
      qty: {
        type: Number,
        default: 1,
      },
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
      comment:{
        type:String,
        required:false
      }
    }],
    status: {
      type: String,
      default: "pending",

    },
    dateEntry: {
      type: Date,
      default: Date.now,
    },
    dateProcessed: {
      type: Date,
      required: false,
      default: Date.now,
    },
  }
);

orderSchema.plugin(mongoosePaginate);

module.exports = model("Order", orderSchema);

//el método nuevo retorna un nueva propiedad(paginate)
