const mongoose= require("mongoose");
mongoose.set("strictQuery", true);
module.exports = ()=>{
    mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connected"));
    return mongoose;
};

// mongodb://127.0.0.1:27017/rem

// mongodb+srv://thang5555:ANHanh9x@deeviscomongodb.ygmbzai.mongodb.net/rem
