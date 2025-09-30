const mongoose = require("../../common/database")();

const danhgiaSchema = new mongoose.Schema({
   
    name: {
        type: String,
        required: true,
    },
    mail: {
        type: String,
        required: true, 
    },
    content: {
        type: String,
    },
    sao: {
        type: Number,
    },
    pr_id: {
        type: String,
    }
    
}, {
    timestamps: true,
});

const DanhgiaModel = mongoose.model("Danhgia", danhgiaSchema, "danhgia");
module.exports = DanhgiaModel; 
