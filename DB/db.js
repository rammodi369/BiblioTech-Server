const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose
    .connect('mongodb://localhost:27017/libraryDB')
    .then(() => {
      console.log("DB IS CONNECTED");
    })
    .catch((err) => {
      console.log("Error connecting to db !!", err);
    });
};

module.exports = connectDB;
