const mongoose = require("../../common/database")();

const hangSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
          
    },
    slug: {
        type: String,
        default: null,
    },
    images: {
        type: String,
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

const HangModel = mongoose.model("Hang", hangSchema, "hang");
module.exports = HangModel; 
