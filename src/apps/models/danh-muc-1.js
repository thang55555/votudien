const mongoose = require("../../common/database")();

const danhmuc1Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
          
    },
    slug: {
        type: String,
        default: null,
    },
    
     title:{
        type: String,
	    required: true,
    },
    description:{
        type: String,
	    required: true,
    },
    keywords:{
        type: String,
	    required: true,
    },
        view:{
        type: Number,
    },
}, {
    timestamps: true,
});

const Danhmuc1Model = mongoose.model("Danhmuc1", danhmuc1Schema, "danhmuc1");
module.exports = Danhmuc1Model; 
