const mongoose = require("../../common/database")();

const danhmuc2Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
           text: true,
    },
    slug: {
        type: String,
        default: null,
    },
    danhmuc1_id: {
      type: mongoose.SchemaTypes.ObjectId,
        ref: "Danhmuc1",
        required:true
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

const Danhmuc2Model = mongoose.model("Danhmuc2", danhmuc2Schema, "danhmuc2");
module.exports = Danhmuc2Model; 
