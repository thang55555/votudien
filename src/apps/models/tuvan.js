const mongoose = require("../../common/database")();
const tuvanSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
       text: true,
    },
    lienhe:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    diachi:{
        type: String,
        required: true,
    },
    loaicongtrinh:{
        type: String,
        required: true,
    },
    mucdautu:{
        type: String,
        required: true,
    },
    img:{
        type: String,
        required: true,
    },
    yeucau:{
        type: String,
        required: true,
    },
    trangthai:{
        type: Boolean,
    },
 
    
}, {timestamps:true});
const TuvanModel = mongoose.model("Tuvan", tuvanSchema, "tuvan");
module.exports = TuvanModel;