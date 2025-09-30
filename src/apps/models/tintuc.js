const mongoose = require("../../common/database")();

const tintucSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        text: true,
    },
    slug:{
        type: String,
        required: true,
    },
    trangthai: {
        type: Boolean,
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
    image: {
        type: String,
        required: true,
    },
    content:{
        type: Array,
    },
    content2:{
        type: Array,
    },
        view:{
        type: Number,
    },
}, {
    timestamps: true,
});

const TintucModel = mongoose.model("Tintuc", tintucSchema, "tintuc");
module.exports = TintucModel; 
