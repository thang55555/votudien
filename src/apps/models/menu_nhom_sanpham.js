const mongoose = require("../../common/database")();

const menu_nhom_sanphamSchema = new mongoose.Schema({
    danhmuc_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu_danhmuc_sanpham",
    },
    tennhomsanpham: {
        type: String,
        required: true,
    },
    slug:{
        type: String,
        required: true,
    }, 
    quytrinh: [],
}, {
    timestamps: true,
});

const Menu_nhom_sanphamModel = mongoose.model("Menu_nhom_sanpham", menu_nhom_sanphamSchema, "menu_nhom_sanpham");
module.exports = Menu_nhom_sanphamModel; 
