const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");


const orderSchema = new Schema({
        userId: {
            type: String,
            required: true,
        },
        client: {
            type: String,
        },
        products: [{
            qty: { //qty por  producto
              type: Number,
              default: 0,
            }, 
            subTotal: {
                type: Number,
                required: false,
             },
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
            },
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
        dateDelivering: {
            type: Date,
            required: false,
            default: Date.now,
        },
        dateDone: {
            type: Date,
            required: false,
            default: Date.now,
        },
        dateCanceled: {
            type: Date,
            required: false,
            default: Date.now,
        },
        timeResult: {
            type: String,
            default: "",
            required: false,
        },
        additional: {
            type: String,
            default: "",
            required: false,
        },
        totalQty: {
            type: Number,
            default: 0,
            required: false,
        },
        total: {
            type: Number,
            default: 0,
            required: false,

        },
        numberTable: {
            type: Number,
            default: 1,
            required: false,

        },
    }, {
        timestamps: true,
        versionKey: false,
    }

);

orderSchema.plugin(mongoosePaginate);

module.exports = model("Order", orderSchema);

//el método nuevo retorna un nueva propiedad(paginate)