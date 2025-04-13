const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose
    .connect('mongodb+srv://rammodi0509:IzGy9yR7fJq5uOkc@cluster0.yx3dmoo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
      console.log("DB IS CONNECTED");
    })
    .catch((err) => {
      console.log("Error connecting to db !!", err);
    });
};

module.exports = connectDB;
