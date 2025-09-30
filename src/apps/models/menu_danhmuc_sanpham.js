const mongoose = require("../../common/database")();
const menu_danhmuc_sanphamSchema = new mongoose.Schema({
    tendanhmuc:{
        type: String,
        required: true,
    },
    slug:{
        type: String,
        required: true,
    },
 
    content: []
 
    
}, {timestamps:true});
const Menu_danhmuc_sanphamModel = mongoose.model("Menu_danhmuc_sanpham", menu_danhmuc_sanphamSchema, "menu_danhmuc_sanpham");
module.exports = Menu_danhmuc_sanphamModel;