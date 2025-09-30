const mongoose = require("../../common/database")();
const menu_tintucSchema = new mongoose.Schema({
    menutintuc:{
        type: String,
        required: true,
    },
    slug:{
        type: String,
        required: true,
    },
    linkvideo:{
        type: String,
        required: true,
    },
  
    
}, {timestamps:true});
const Menu_tintucModel = mongoose.model("Menu_tintuc", menu_tintucSchema, "menu_tintuc");
module.exports = Menu_tintucModel;