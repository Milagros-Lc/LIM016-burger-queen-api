const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')

/*
"id": 1,
"name": "Café americano",
"price": 8,
"image": "../../assets/images/cafe_americano.png",
"type": "cafes",
"dateEntry": "21/01/2022 09:24:00",
"qty": 0,
"subTotal": 8,
"messageCard": "Producto agregado."
*/
const productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
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
    // qty: {
    //     type: Number,
    //     required: false,
    // },
    // subTotal: {
    //     type: Number,
    //     required: false,
    // },
    messageCard: {
        type: String,
        required: false
    }
}, {
    timestamps: true,
    versionKey: false,
});

productSchema.plugin(mongoosePaginate)

module.exports = model('Product', productSchema);