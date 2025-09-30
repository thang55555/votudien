const mongoose = require("../../common/database")();
const productSchema = new mongoose.Schema({
    danhmuc2_id: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Danhmuc2",
        required: true
    }],
    danhmuc1_id: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Danhmuc1",
        required: true
    }],
    hang_id: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Hang",
    }],
    name: {
        type: String,
        required: true,
        text: true,
    },
    masanpham: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    keywords: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        default: null,
    },
    price: {
        type: Number,
        default: 0,
    },
    pricesale: {
        type: Number,
        default: 0,
    },
    content: {
        type: Array,
    },
    content2: {
        type: Array,
    },
    spmoi: {
        type: Boolean,
    },
    spnoibat: {
        type: Boolean,
    },
    spcaocap: {
        type: Boolean,
    },
    trangthai: {
        type: Boolean,
    },
    view: {
        type: Number,
    },
    images: [{
        name: {
            type: String,
            required: true,
        },
        stt: {
            type: String,
            required: true,
        },
    }]
}, { timestamps: true });
const ProductModel = mongoose.model("Products", productSchema, "product");
module.exports = ProductModel;