const mongoose = require("../../common/database")();

const product_sanphamSchema = new mongoose.Schema({
    nhomsp_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu_nhom_sanpham",
    },
    tieudesp: {
        type: String,
        required: true,
        text: true,
    },
    metadescription: {
        type: String,
        required: true,
    },
    metakeywords: {
        type: String,
        required: true,
    }, 
    spdv: {
        type: Boolean,
        required: true,
    },
    nhap: {
        type: Boolean,
    },
    menudichvu_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu_dichvu",
    },
    slug:{
        type: String,
        required: true,
    },
    chudautu: {
        type: String,
        required: true,
    },
    congnang: {
        type: String,
        required: true,
    },
    diachi: {
        type: String,
        required: true,
    },
    kinhphi: {
        type: String,
        required: true,
    },
    loaihinh: {
        type: String,
        required: true,
    },
    donvi: {
        type: String,
        required: true,
    },
    dientich: {
        type: String,
        required: true,
    },
    namthicong: {
        type: String,
        required: true,
    },
    image: [{
        images: {
            type: String,
            required: true,
        },
        stt: {
            type: String,
            required: true
        }
    }],
    content: []
    
}, {
    timestamps: true,
});

const Product_sanphamModel = mongoose.model("Product_sanpham", product_sanphamSchema, "product_sanpham");
module.exports = Product_sanphamModel; 
