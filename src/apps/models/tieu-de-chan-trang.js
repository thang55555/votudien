const mongoose = require("../../common/database")();

const chantrangSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,  
    }
}, {
    timestamps: true,
});

const ChantrangModel = mongoose.model("Chantrang", chantrangSchema, "chantrang");
module.exports = ChantrangModel; 
