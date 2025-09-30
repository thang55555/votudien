const mongoose = require("../../common/database")();

const baivietdichvuSchema = new mongoose.Schema({
    menudichvu_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu_dichvu",
    },
    tieudesp: {
        type: String,
        required: true,
        text: true,
    },
    nhap: {
        type: Boolean,
    },
    metadescription: {
        type: String,
        required: true,
    },
    metakeywords: {
        type: String,
        required: true,
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
    content: [],
    image: [{
        images:{
            type: String,
            required: true,
        },
        stt:{
            type: String,
            required: true,
        }
    }]
}, {
    timestamps: true,
});

const BaivietdichvuModel = mongoose.model("Baiviet_dichvu", baivietdichvuSchema, "baiviet_dichvu");
module.exports = BaivietdichvuModel; 
