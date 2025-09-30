const mongoose = require("../../common/database")();

const chatSchema = new mongoose.Schema({
    userId: {
        type: String,
        default: "guest"
    },
    messages: [
        {
            role: { type: String, enum: ["user", "bot"], required: true },
            message: { type: String, required: true },
            timestamp: { type: Date, default: Date.now }
        }
    ]
}, {
    timestamps: true
});

const ChatModel = mongoose.model("Chat", chatSchema, "chat");
module.exports = ChatModel;
