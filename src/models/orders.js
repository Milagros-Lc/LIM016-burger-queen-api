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
            /* qty: {
              type: Number,
              default: 0,
            }, */
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
            },
            /*  comment:{
               type:String,
               required:false
             } */
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

        },
        additional: {
            type: String,
            default: "",

        },
        totalQty: {
            type: Number,
            required: false,
        },
        total: {
            type: Number,
            required: false,
        },
        numberTable: {
            type: Number,
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