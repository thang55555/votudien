const mongoose = require("../../common/database")();
const orderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    add1: {
        type: String,
        required: true,
    },
    add2: {
        type: String,
    },
    mail: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    cty: {
        type: String,
    },
    note: {
        type: String,
    },
    thanhtoan: {
        type: String,
        required: true,
    },
    madon: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
      trangthai: {
        type: Boolean,
    },
    item: [{
        id: {
            type: String,
        },
        name: {
            type: String,
        },
        thumbnail: {
            type: String,
        },
        price: {
            type: String,
        },
        qty: {
            type: String,
        },
    }],
}, {
    timestamps: true,
});

const OrderModel = mongoose.model("Order", orderSchema, "order");
module.exports = OrderModel; 
