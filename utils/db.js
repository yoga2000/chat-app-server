const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const dbConnection = () => {
  const url = `mongodb+srv://root:${process.env.PASSWORD}@yogaraj.m4uknnq.mongodb.net/${process.env.DB}?retryWrites=true&w=majority&appName=yogaraj`;
  mongoose
    .connect(url, {
      serverSelectionTimeoutMS: 30000, // Timeout after 30s
      socketTimeoutMS: 45000,
    })
    .then(() => {
      console.log("Connected to database ");
    })
    .catch((err) => {
      console.error(`Error connecting to the database. \n${err}`);
    });
};

module.exports = { dbConnection };
