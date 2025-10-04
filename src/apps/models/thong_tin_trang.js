const mongoose = require("../../common/database")();
const thong_tin_trangSchema = new mongoose.Schema({
    sdt:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    tencongty:{
        type: String,
        required: true,
    },
    diachicty:{
        type: String,
        required: true,
    },
    diachikho:{
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
    tieudeFB:{
        type: String,
        required: true,
    },
    diachiFB:{
        type: String,
        required: true,
    },
    linkFB:{
        type: String,
        required: true,
    },
    tieudeMap:{
        type: String,
        required: true,
    },
    diachiMap:{
        type: String,
        required: true,
    },
    linkMap:{
        type: String,
        required: true,
    },
    gioithieu:{
        type: String,
        required: true,
    },
    images:{
        type: String,
        required: true,
    },
    video:{
        type: String,
        required: true,
    }
 
    
}, {timestamps:true});
const Thong_tin_trangModel = mongoose.model("Thong_tin_trang", thong_tin_trangSchema, "thong_tin_trang");
module.exports = Thong_tin_trangModel;