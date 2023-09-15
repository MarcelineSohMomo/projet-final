const mongoose = require('mongoose');
// var mongoDB = 'mongodb+srv://marcelinesohmomo:Marceline96.@cluster0.lmqcikw.mongodb.net/?retryWrites=true&w=majority';
var mongoDB = "mongodb+srv://marcelinesohmomo:Marceline96.@cluster0.lmqcikw.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(mongoDB, {
        useNewUrlParser: true,
    }).then(() => console.log("Connected to mongoDB"))
    .catch((err) => console.log("Failed to connect to MongoDB", err))