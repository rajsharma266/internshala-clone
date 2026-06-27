const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config({
  path: path.resolve(__dirname, "../internarea/.env"),
});
require("dotenv").config({
  path: path.resolve(__dirname, ".env"),
});

const url = process.env.MONGO_URI || process.env.MONGODB_URI;

module.exports.connect = async () => {
  if (!url) {
    throw new Error("MONGO_URI or MONGODB_URI is not configured");
  }

  await mongoose.connect(url, {
    serverSelectionTimeoutMS: 5000,
  });

  console.log("Database is connected");
};
