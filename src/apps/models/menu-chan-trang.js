const mongoose = require("../../common/database")();

const menuchantrangSchema = new mongoose.Schema({
    chantrang_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Chantrang",
        required: true
    },
    name: {
        type: String,
        required: true,
        text: true,
    },
    slug: {
        type: String,
        required: true,
    },
    trangthai: {
        type: Boolean,
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
    content: {
        type: String,
    },
    view: {
        type: Number,
    },
}, {
    timestamps: true,
});

const MenuchantrangModel = mongoose.model("Menuchantrang", menuchantrangSchema, "menuchantrang");
module.exports = MenuchantrangModel; 
